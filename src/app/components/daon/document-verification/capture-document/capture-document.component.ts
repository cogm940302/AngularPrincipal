import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as DocumentCapture from '../../../../../assets/js/Daon.DocumentCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesGeneralService, isMobile } from '../../../../services/general/services-general.service';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { SessionService } from 'src/app/services/session/session.service.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-capture-document',
  templateUrl: './capture-document.component.html',
  styleUrls: ['./capture-document.component.css']
})
export class CaptureDocumentComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService,
              private session: SessionService, private actRoute: ActivatedRoute, private spinner: NgxSpinnerService) {

    this.htmlCanvasToBlob();
    if (serviciogeneralService.gettI() !== undefined) {
      sessionStorage.setItem('ti', serviciogeneralService.gettI());
    } else if (sessionStorage.getItem('ti') === undefined) {
      this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
    }

    this.dc = new DocumentCapture.Daon.DocumentCapture({
      url: 'https://dobsdemo-docquality-first.identityx-cloud.com/rest/v1/quality/assessments',
      documentType: sessionStorage.getItem('ti'),
    });

  }

  filtersLoaded: Promise<boolean>;
  mensaje: string;
  id: string;
  dc: any;
  img: any;
  isMobileBool: boolean;
  isEdge: boolean;

  async ngOnInit() {
    await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!await this.alredySessionExist()) { return; }
    await this.spinner.hide();
    this.filtersLoaded =  Promise.resolve(true);

    this.isMobileBool = isMobile(navigator.userAgent);
    this.isEdge = window.navigator.userAgent.indexOf('Edge') > -1;

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

  async enter() {
    await this.spinner.show();
    this.dc.capture().then(async response => {
      console.log(response);
      if (response.result === 'FAIL') {
        this.mensaje = response.feedback;
        console.log('no pasa');
        await this.spinner.hide();
      } else if (response.result === 'PASS') {
        console.log('siii pasa');
        this.dc.stopCamera();
        this.dc.stopAutoCapture();
        this.img = 'data:image/jpeg;base64,' + response.responseBase64Image;
        console.log(this.img);
        this.serviciogeneralService.setImg64(this.img);
        this.serviciogeneralService.setIsUpload(false);
        await this.spinner.hide();
        this.router.navigate([Rutas.documentConfirm + `${this.id}`]);
      }
    })
      .catch(async err => {
        this.mensaje = err;
        console.log('err= ' + err);
        await this.spinner.hide();
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
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
    const c = this.canvas;
    this.mensaje = 'Posiciona tu documento dentro del area';
    console.log('captura');
    this.videoEl = document.querySelector('video');

    this.dc.startCamera(this.videoEl).then((response) => {

      console.log(response);
    });
  }

  htmlCanvasToBlob() {
    if (!HTMLCanvasElement.prototype.toBlob) {
      console.log('HTMLCanvasElement.prototype.toBlob 1 ' + HTMLCanvasElement.prototype.toBlob);
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
          let canvas = this;
          setTimeout(() => {
            var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
            len = binStr.length,
            arr = new Uint8Array(len);

            for (let i = 0; i < len; i++ ) {
               arr[i] = binStr.charCodeAt(i);
            }

            callback( new Blob( [arr], {type: type || 'image/png'} ) );
          });
        }
     });
    }
  }

}
