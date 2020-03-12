import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import * as DocumentCapture from '../../../../../assets/js/Daon.DocumentCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesGeneralService, isMobile } from '../../../../services/general/services-general.service';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { SessionService } from 'src/app/services/session/session.service.js';

@Component({
  selector: 'app-capture-document',
  templateUrl: './capture-document.component.html',
  styleUrls: ['./capture-document.component.css']
})
export class CaptureDocumentComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService,
              private session: SessionService, private actRoute: ActivatedRoute) {
    this.htmlCanvasToBlob();
    if (serviciogeneralService.gettI() !== undefined) {
      sessionStorage.setItem('ti', serviciogeneralService.gettI());
    } else if (sessionStorage.getItem('ti') === undefined) {
      this.router.navigate([Rutas.chooseIdentity]);
    }
    this.fc = new DocumentCapture.Daon.DocumentCapture({
      url: 'https://dobsdemo-docquality-first.identityx-cloud.com/rest/v1/quality/assessments',
      documentType: 'ID_CARD'//sessionStorage.getItem('ti'),
    });
  }

  filtersLoaded: Promise<boolean>;
  mensaje: string;
  id: string;
  fc: any;
  img: any;
  isMobileBool:boolean;
  isEdge:boolean;

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    //if (!this.alredySessionExist()) { return; }
    this.filtersLoaded =  Promise.resolve(true);

    this.isMobileBool= isMobile(navigator.userAgent);
    this.isEdge = window.navigator.userAgent.indexOf("Edge") > -1;

    this.capturar();
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
      } else if (object.daon.identity) {
        this.router.navigate([Rutas.livenessInstruction + `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  enter() {
    this.fc.capture().then(response => {
      console.log(response);
      if (response.result === 'FAIL') {
        this.mensaje = response.feedback;
        console.log('no pasa');
      } else if (response.result === 'PASS') {
        this.fc.stopCamera();
        this.fc.stopAutoCapture();
        this.img = 'data:image/jpeg;base64,' + response.responseBase64Image;
        this.serviciogeneralService.setImg64(this.img);
        this.router.navigate([Rutas.documentConfirm+ `${this.id}`]);
      }
    })
      .catch(err => {
        console.log('err= ' + err);
      });
  }


  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  videoEl;
  capturar() {
    let c = this.canvas;
    this.mensaje = 'Position your document inside the area';
    console.log('captura');
    this.videoEl = document.querySelector('video');
    //this.videoEl.addEventListener('play', this.f(document.querySelector("video"),document.getElementById("scream_green")) );
    //navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user' } }).then(stream => { this.videoEl.srcObject = stream; }).catch(error => { console.error('Cannot get camera feed', error); alert('Unable to get hold of your camera.\nPlease ensure no other page/app is using it and reload.'); });

    this.fc.startCamera(this.videoEl).then((response) => {
     
      console.log(response);
    });
    // this.videoEl.onloadedmetadata = () => {
    //   c.nativeElement.width = this.videoEl.videoWidth/2.5;
    //   c.nativeElement.height = this.videoEl.videoHeight/2.5;
    //   console.log('result ' + this.videoEl.videoWidth + " - " + this.videoEl.videoHeight);
    // };

  }

  htmlCanvasToBlob(){
    if (!HTMLCanvasElement.prototype.toBlob) {
      console.log("HTMLCanvasElement.prototype.toBlob 1 " + HTMLCanvasElement.prototype.toBlob);
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
          var canvas = this;
          setTimeout(function() {
            var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
            len = binStr.length,
            arr = new Uint8Array(len);
    
            for (var i = 0; i < len; i++ ) {
               arr[i] = binStr.charCodeAt(i);
            }
    
            callback( new Blob( [arr], {type: type || 'image/png'} ) );
          });
        }
     });
    }
  }

}
