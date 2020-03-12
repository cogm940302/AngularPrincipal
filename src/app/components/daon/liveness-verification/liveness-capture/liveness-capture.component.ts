import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as FaceLineness3D from "../../../../../assets/js/Daon.FaceLiveness3D.min.js";
import * as Daonjs from '../../../../../assets/js/Daon.FaceCapture.min.js';
import { CheckID } from "../../../../model/DaonPojos/CheckID";
import { ServicesGeneralService, isMobile } from "../../../../services/general/services-general.service";
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service.js';

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
  f3d:any;
  ctx: CanvasRenderingContext2D;
  isMobileBool:boolean;
  isEdge:boolean;
  navegador:any;

  constructor(public serviciogeneralService: ServicesGeneralService, public router: Router,
              private session: SessionService, private actRoute: ActivatedRoute) {
    this.fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });
  }

  instructions = document.querySelector('#instructions');
  ngOnInit() {  
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    //if (!this.alredySessionExist()) { return; }
    this.isMobileBool= isMobile(navigator.userAgent);
    this.isEdge = window.navigator.userAgent.indexOf("Edge") > -1;
    this.blnStart = true;
    this.capturar();
    this.navegador = navigator.userAgent;
    this.checkIdsGetSend = new CheckID();
    this.checkIdsGetSend.url = 'https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAzh6_OChWzVmPL_Oc2BKgSsw/idchecks';
    this.checkIdsGetSend.metodo = 'GET';
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
        this.router.navigate([Rutas.fin]);
        return false;
      } else {
        return true;
      }
    }
  }

  getChecksID(value) {
    this.serviciogeneralService.sendDaon(this.checkIdsGetSend).subscribe(data => {
      console.log(JSON.stringify(data, null, 2));
      if (data.errorType) {
        console.log("errorType= " + JSON.stringify(data, null, 2));
      } else {
        console.log("link pa el video= " + JSON.stringify(data.body.items[0].videos.href, null, 2));
        this.sendLivenessDaon(data.body.items[0].videos.href, value);
      }
    });
  }

  sendLivenessDaon(href, value) {
    let jsonvideo = {
      "url": href,
      "metodo": "POST",
      "subtype": "SVR3DFL_CHALLENGE",
      "captured": new Date().toISOString(),
      "videoFormat": "SVR3DFL",
      "challenges": [{
        "challenge": {
          "id": "ht1Vz_BTInMOFYlb42QaYg",
          "type": "SVR3DFL"
        },
        "start": 0,
        "completed": 99999
      }],
      "sensitiveData": {
        "format": "SVR3DFL",
        "value": value
      }
    };
    console.log("jsonvideo= " + JSON.stringify(jsonvideo, null, 2));
    this.serviciogeneralService.sendDaon(jsonvideo).subscribe(data => {
      if (data.errorType) {
        console.log("errorType= " + JSON.stringify(data, null, 2));
      } else {
        console.log("link data= " + JSON.stringify(data, null, 2));

        if (data.statusCode == "200") {
          //if(data.body.processingStatus != "FAILED"){
          this.serviciogeneralService.setResultLiveness(data.body.processingStatus);
          this.serviciogeneralService.setMensaje(data.body.items[0].processingErrors.items[0].message);
          this.router.navigate([Rutas.livenessResult + "/5e559f279279300008700482"]);
          //}
        } else if (data.statusCode == "400") {
          this.serviciogeneralService.setResultLiveness(data.body.name);
          this.serviciogeneralService.setMensaje(data.body.message);
          this.router.navigate([Rutas.livenessResult + "/5e559f279279300008700482"]);
        }
      }
    });
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
      video: document.querySelector("video"),
      onUpdate: this.onUpdate,
      onTemplateCreated: this.FonTemplateCreated,
      movementDelay: 1250
    };
    setTimeout(() => {
      this.f3d.initialize(config);
      this.f3d.startProcessing();
      this.f3d.startSession();  
    }, 800)
  }
  
  capturar() {  
    this.fc.startCamera(document.querySelector("video")).then((response) => {
      this.onCameraStarted(this.fc);
    });
  }

  onCameraStarted = fc => {
    const video = document.querySelector("video");
    video.onloadedmetadata = () => {
        const { width, height } = fc.camera.settings;
        if (isMobile(navigator.userAgent) && width > height) {
            fc.camera.videoTracks[0].applyConstraints({ width, height }).then(() => {
            })
        }
    }
}

FonTemplateCreated = (tpl) => {
  const base64template = this.arrayBufferToBase64(tpl);
  this.getChecksID(base64template);
  //this.f3d.terminate();
};

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
      this.instTxt = TYPES.MOVE_CLOSER;
      this.startAnimation(2300);
      break;
    case TYPES.READY: 
      this.instTxt = 'Please center your face so it fills the guide.';
      break;
    case TYPES.AWAIT_RESULTS:
      this.instTxt = 'analyzing...';
      this.drawOutline(document.getElementById("scream_sn"));
      break;
    case TYPES.END_CAPTURE: 
      this.instTxt = TYPES.END_CAPTURE;
      this.instTxt = '';
      break;
    case TYPES.NOT_CENTERED: 
      this.instTxt = 'Center Face';
      this.drawOutline(document.getElementById("scream_r"));
      break;
    case TYPES.TOO_FAR: 
      this.instTxt = 'Too Far';
      this.drawOutline(document.getElementById("scream_r"));
      break;
    case TYPES.TOO_CLOSE: 
      this.instTxt = 'Too Close';
      this.drawOutline(document.getElementById("scream_r"));
      break;
    case TYPES.HOLD: 
      this.instTxt = TYPES.HOLD;
      this.drawOutline(document.getElementById("scream_g"));
      break;
    case TYPES.FACE_BOX: 
      //this.instTxt = "sin reconocimiento facial";
      //this.drawOutline(document.getElementById("scream_sn"));
      break;
  }
});


  drawOutline(img) {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let scale = 0.55;
    if (this.canvas.nativeElement.width < this.canvas.nativeElement.height) {
      scale = isMobile(navigator.userAgent) ? 0.75 : 0.75;
    }
    let dx = (this.canvas.nativeElement.width - img.width * scale) / 2;
    let dy = (this.canvas.nativeElement.height - img.height * scale * 1.4) / 2;
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
      let newScale = 1 + animationScalePerSec * (currentTS - animationStartTS) / 1000;

      this.ctx.setTransform(newScale, 0, 0, newScale, -this.canvas.nativeElement.width * (newScale - 1) / 2, -this.canvas.nativeElement.height * (newScale - 1) / 2);
      this.drawOutline(document.getElementById("scream_g"));
      setTimeout(() => this.stepAnimation(animationStartTS, animationStopTS, animationScalePerSec), animationStepDuration);
    }
    else {
      console.log('skip stepAnimation');
    }
  }


}


export function getLabelForMessage(message, UPDATE_TYPES) {
  // const START = 'Please center your face so it fills the guide.'
  // const AWAIT_RESULTS = 'Please wait for the result. On slow devices it can take a few seconds.'
  const TOO_CLOSE = 'Too Close'
  // const TOO_CLOSE_ML = 'Too\nClose'
  const TOO_FAR = 'Too Far'
  // const TOO_FAR_ML = 'Too\nFar'
  // const NOT_CENTERED = 'Center Face'
  const NOT_CENTERED_ML = 'Center\nFace'
  const HOLD = 'Hold...'
  // const MOVE = 'Move Device Closer Now'
  const MOVE_ML = 'Move\nCloser\nNow'
  const ANALYSING = 'Analysing...'
  const NONE = '';

  switch (message) {
    case UPDATE_TYPES.READY:
    case UPDATE_TYPES.END_CAPTURE:
      return NONE;
    case UPDATE_TYPES.AWAIT_RESULTS:
      return ANALYSING;
    case UPDATE_TYPES.NOT_CENTERED:
      return NOT_CENTERED_ML;
    case UPDATE_TYPES.TOO_FAR:
      return TOO_FAR;
    case UPDATE_TYPES.TOO_CLOSE:
      return TOO_CLOSE;
    case UPDATE_TYPES.HOLD:
      return HOLD;
    case UPDATE_TYPES.MOVE_CLOSER:
      return MOVE_ML;
    default:
      return undefined;
  }
}
