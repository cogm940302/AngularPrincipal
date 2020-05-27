import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as FaceLineness3D from '../../../../../assets/js/Daon.FaceLiveness3D.min.js';
import * as Daonjs from '../../../../../assets/js/Daon.FaceCapture.min.js';
import { CheckID } from '../../../../model/DaonPojos/CheckID';
import { ServicesGeneralService, isMobile } from '../../../../services/general/services-general.service';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service.js';
import { MiddleDaonService } from '../../../../services/http/middle-daon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorVidaService } from 'src/app/services/errores/error-vida.service.js';
import { environment } from '../../../../../environments/environment';
import { FP } from '@fp-pro/client';

@Component({
  selector: 'app-liveness-capture',
  templateUrl: './liveness-capture.component.html',
  styleUrls: ['./liveness-capture.component.css']

})
export class LivenessCaptureComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  instTxt: any;
  blnStart: boolean;
  checkIdsGetSend: any;
  id: string;
  fc: any;
  f3d: any;
  ctx: CanvasRenderingContext2D;
  isMobileBool: boolean;
  isEdge: boolean;
  navegador: any;

  constructor(public serviciogeneralService: ServicesGeneralService, public router: Router,
              private session: SessionService, private actRoute: ActivatedRoute, private middleDaon: MiddleDaonService,
              private spinner: NgxSpinnerService, private errorVidaService: ErrorVidaService) {
    this.fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });
  }

  instructions = document.querySelector('#instructions');
  async ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({tag: {tag:this.id}});
    if (!(await this.alredySessionExist())) { return; }
    this.isMobileBool = isMobile(navigator.userAgent);
    this.isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
    this.blnStart = true;
    this.capturar();
    this.navegador = navigator.userAgent;
    this.checkIdsGetSend = new CheckID();
    this.checkIdsGetSend.url = 'https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAzh6_OChWzVmPL_Oc2BKgSsw/idchecks';
    this.checkIdsGetSend.metodo = 'GET';

    setTimeout(() => {
      console.log('sleep');
      this.startButton();
    }, 5000);
    
    
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.daon.pruebaVida) {
        this.router.navigate([Rutas.cuentaClabe+ `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  async getChecksID(value) {
    await this.spinner.show();
    if (await this.sendLivenessDaon('', value)) {
      const object = this.session.getObjectSession();
      object.daon.pruebaVida = true;
      //object.estatus = 'Terminado';
      this.session.updateModel(object);
      await this.middleDaon.updateDaonDataUser(object, this.id);
      await this.middleDaon.getResults(this.id);
      this.fc.stopCamera();
      this.f3d.terminate();
      console.log('ya termine' + JSON.stringify(object, null, 2));
      this.router.navigate([Rutas.cuentaClabe+ `/${this.id}`]);
    }

    await this.spinner.hide();
    // this.router.navigate([Rutas.livenessCapture + `${this.id}`]);
  }

  async sendLivenessDaon(href, value) {
    const jsonSendFaceDaon = {
      data: value,
    };
    const resultCode = await this.middleDaon.sendInfoDaon(jsonSendFaceDaon, this.id, 'live');
    console.log(resultCode);
    if (resultCode !== 200) {
      console.log('entre al erro');
      this.errorVidaService.mensaje = 'No se ha podido vlaidar tu video, intenta otra vez';
      await this.spinner.hide();
      console.log('ocurrio un error, favor de reintentar');
      this.router.navigate([Rutas.livenessInstruction + `${this.id}`]);
      return false;
    }
    return true;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  startButton() {
    this.blnStart = false;
    const DaonFaceQualityLiteWasm = window.location.origin + '/assets/js/DaonFaceQualityLite.wasm';
    this.f3d = new FaceLineness3D.Daon.FaceLiveness3D(DaonFaceQualityLiteWasm);
    const config = {
      video: document.querySelector('video'),
      onUpdate: this.onUpdate,
      onTemplateCreated: this.FonTemplateCreated,
      movementDelay: 1250
    };
    setTimeout(() => {
      this.f3d.initialize(config);
      this.f3d.startProcessing();
      this.f3d.startSession();
    }, 800);
  }

  capturar() {
    this.fc.startCamera(document.querySelector('video')).then((response) => {
      this.onCameraStarted(this.fc);
    });
  }

  onCameraStarted = fc => {
    const video = document.querySelector('video');
    video.onloadedmetadata = () => {
      const { width, height } = fc.camera.settings;
      if (isMobile(navigator.userAgent) && width > height) {
        fc.camera.videoTracks[0].applyConstraints({ width, height }).then(() => {
        });
      }
    };
  }

  FonTemplateCreated = (tpl) => {
    const base64template = this.arrayBufferToBase64(tpl);
    this.getChecksID(base64template);
  }

  onUpdate = ((updateType, additional_data) => {
    const TYPES = FaceLineness3D.Daon.FaceLiveness3D.UPDATE_TYPES;
    switch (updateType) {
      case TYPES.ERROR:
        if (additional_data) {
          alert('3DFL returned an error: ' + additional_data);
        } else {
          alert('3DFL returned an error.');
        }
        break;
      case TYPES.MOVE_CLOSER:
        this.instTxt = 'Acercate';
        this.startAnimation(2300);
        break;
      case TYPES.READY:
        this.instTxt = 'Por favor, centra tu cara en las lineas guía';
        break;
      case TYPES.AWAIT_RESULTS:
        this.instTxt = 'Analizando';
        this.drawOutline(document.getElementById('scream_sn'));
        break;
      case TYPES.END_CAPTURE:
        this.instTxt = '';
        break;
      case TYPES.NOT_CENTERED:
        this.instTxt = 'Centra la Cara';
        this.drawOutline(document.getElementById('scream_r'));
        break;
      case TYPES.TOO_FAR:
        this.instTxt = 'Muy Lejos';
        this.drawOutline(document.getElementById('scream_r'));
        break;
      case TYPES.TOO_CLOSE:
        this.instTxt = 'Muy Cerca';
        this.drawOutline(document.getElementById('scream_r'));
        break;
      case TYPES.HOLD:
        this.instTxt = 'Quieto';
        this.drawOutline(document.getElementById('scream_g'));
        break;
      case TYPES.FACE_BOX:
        //this.instTxt = 'sin reconocimiento facial';
        //this.drawOutline(document.getElementById('scream_sn'));
        break;
    }
  });


  drawOutline(img) {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let scale = 0.55;
    if (this.canvas.nativeElement.width < this.canvas.nativeElement.height) {
      scale = isMobile(navigator.userAgent) ? 0.75 : 0.75;
    }
    const dx = (this.canvas.nativeElement.width - img.width * scale) / 2;
    const dy = (this.canvas.nativeElement.height - img.height * scale * 1.4) / 2;
    this.ctx.globalAlpha = 0.7;
    this.ctx.drawImage(img, dx, dy,
      img.width * scale,
      img.height * scale * 1.4);
  }

  startAnimation(duration) {
    const animationStartTS = performance.now();
    const animationStopTS = animationStartTS + duration;
    const animationScalePerSec = (1.6 - 1) / duration * 1000;
    this.stepAnimation(animationStartTS, animationStopTS, animationScalePerSec);
  }


  stepAnimation = (animationStartTS, animationStopTS, animationScalePerSec) => {
    const animationStepDuration = 40; // 25fps
    const currentTS = performance.now();
    if (currentTS < animationStopTS) {
      const newScale = 1 + animationScalePerSec * (currentTS - animationStartTS) / 1000;
      this.ctx.setTransform(newScale, 0, 0, newScale, -this.canvas.nativeElement.width * (newScale - 1) / 2, -this.canvas.nativeElement.height * (newScale - 1) / 2);
      this.drawOutline(document.getElementById('scream_g'));
      setTimeout(() => this.stepAnimation(animationStartTS, animationStopTS, animationScalePerSec), animationStepDuration);
    } else {
      console.log('skip stepAnimation');
    }
  }
}
