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

})
export class LivenessCaptureComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  instTxt: any;
  blnStart: boolean;
  checkIdsGetSend: any;
  id: string;
  fc: any;
  constructor(public serviciogeneralService: ServicesGeneralService, public router: Router,
              private session: SessionService, private actRoute: ActivatedRoute) {
    this.fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });

  }
  navegador;
  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!this.alredySessionExist()) { return; }
    console.log('Navegador= ' + navigator.userAgent);
    this.navegador = navigator.userAgent;
    this.blnStart = false;
    this.capturar();
    this.checkIdsGetSend = new CheckID();
    this.checkIdsGetSend.url = 'https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAzh6_OChWzVmPL_Oc2BKgSsw/idchecks';
    this.checkIdsGetSend.metodo = 'GET';
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos]);
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

  f = (videoEl1, img, b, ww, hh, xx, text) => {

    let c2 = this.canvas;

    function step() {
      let ctx = c2.nativeElement.getContext('2d');

      ctx.drawImage(videoEl1, 0, 0, c2.nativeElement.width, c2.nativeElement.height);
      //ctx.drawImage(img, (xx*150), (xx*330), c2.nativeElement.width*ww, c2.nativeElement.height*hh);

      if (b) {
        ctx.drawImage(img, -50 * xx, -300 * xx, (c2.nativeElement.width + (100 * xx)), (c2.nativeElement.height + (600 * xx)));
      } else {
        ctx.font = 'italic 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'green';  // a color name or by using rgb/rgba/hex values

        ctx.fillText(text, (c2.nativeElement.width / 2), c2.nativeElement.height / 2); // text and position
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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

  }
  videoEl;
  instructions = document.querySelector('#instructions');
  x = 1;
  w = 1.5;
  h = 2.4;
  capturar() {
    this.videoEl = document.querySelector("video");
    this.videoEl.addEventListener('play', this.f(document.querySelector("video"), document.getElementById("scream_green"), true, this.w, this.h, 1, ""));
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user' } }).then(stream => { this.videoEl.srcObject = stream; }).catch(error => { console.error('Cannot get camera feed', error); alert('Unable to get hold of your camera.\nPlease ensure no other page/app is using it and reload.'); });


    let FonTemplateCreated = (tpl) => {
      //console.log( tpl);

      const base64template = this.arrayBufferToBase64(tpl);
      //this.props.challengeTemplateUpload(base64template).catch(err => new Error(err));
      console.log("<<<<<<<<<<<<<>>>>>>>>>>>>>>><<<<<<<<<<<<<<" + base64template);
      this.getChecksID(base64template);
    };

    let onUpdate = ((updateType, additional_data) => {
      const TYPES = FaceLineness3D.Daon.FaceLiveness3D.UPDATE_TYPES;
      switch (updateType) {
        case TYPES.ERROR:
          if (additional_data) {
            alert('3DFL returned an error: ' + additional_data);
          } else {
            alert('3DFL returned an error.');
          }
          break;
        case TYPES.READY: this.instTxt = 'Please center your face so it fills the guide.'; break;
        case TYPES.AWAIT_RESULTS: this.instTxt = 'Please wait for the result. On slow devices it can take a few seconds.';
          this.f(document.querySelector("video"), document.getElementById("scream_red"), false, 0, 0, this.x, "Analizando...");
          break;
        case TYPES.END_CAPTURE: this.instTxt = ''; break;
        case TYPES.NOT_CENTERED: this.instTxt = 'Center Face';
          this.f(document.querySelector("video"), document.getElementById("scream_red"), true, 0, 0, this.x, "");
          break;
        case TYPES.TOO_FAR: this.instTxt = 'Too Far';


          if (this.x >= 0.5) {
            // this.w=this.w-this.x;
            // this.h=this.h-this.x;
            this.x = this.x - 0.02;

            this.f(document.querySelector("video"), document.getElementById("scream_green"), true, 0, 0, this.x, "");
          }
          break;
        case TYPES.TOO_CLOSE: this.instTxt = 'Too Close';
          if (this.x < 1) {
            // this.w=this.w-this.x;
            // this.h=this.h-this.x;
            this.x = this.x + 0.02;
            this.f(document.querySelector("video"), document.getElementById("scream_green"), true, 0, 0, this.x, "");
          }

          //console.log("W= " + this.w);
          break;
        //case TYPES.HOLD: outlineImage = outlineImageGreen;

        //Rerenders the face placeholder oval in green, since face is placed

        //Starts face placeholder oval animation.        //Source code ommited due to brewity
        //startAnimation();
        //      break;
        case TYPES.FACE_BOX:       //Face detection occured, `additional_data` contains face coordinates
          break;
      }
    });

    const DaonFaceQualityLiteWasm = window.location.origin + '/assets/js/DaonFaceQualityLite.wasm';
    let f3d = new FaceLineness3D.Daon.FaceLiveness3D(DaonFaceQualityLiteWasm);
    let c = this.canvas;
    this.videoEl.onloadedmetadata = function () {

      this.videoEl = document.querySelector("video");
      c.nativeElement.width = this.videoEl.videoWidth;
      c.nativeElement.height = this.videoEl.videoHeight;

      if (!isMobile(navigator.userAgent)) {
        console.log("No es mobile");
        this.videoEl.play();
        const config = {
          video: this.videoEl,
          onUpdate: onUpdate,
          onTemplateCreated: FonTemplateCreated,
          movementDelay: 1250
        };
        f3d.initialize(config);
        f3d.startProcessing();

        setTimeout(() => f3d.startSession(), 500);
      } else {
        console.log("Si es mobile");
        f3d.videoTracks[0].applyConstraints({ width: this.videoEl.videoWidth, height: this.videoEl.videoHeight }).then(() => {
          this.videoEl.play();
          const config = {
            video: this.videoEl,
            onUpdate: onUpdate,
            onTemplateCreated: FonTemplateCreated,
            movementDelay: 1250
          };
          f3d.initialize(config);
          f3d.startProcessing();
        });
      }




      /**
      f3d.videoTracks[0].applyConstraints({ width:this.videoEl.videoWidth, height:this.videoEl.videoHeight }).then(() => {
        this.videoEl.play();
        const config = {
          video: this.videoEl,
          onUpdate: onUpdate,
          onTemplateCreated: FonTemplateCreated,
          movementDelay: 1250
        };
        f3d.initialize(config);
      f3d.startProcessing();
    });
    console.log("ferrrrrrrrrrrrrr"); */

    }

  }


}
