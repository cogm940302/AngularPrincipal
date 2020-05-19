import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as DocumentCapture from 'src/assets/js/Daon.DocumentCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesGeneralService, isMobile } from '../../../../services/general/services-general.service';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { SessionService } from 'src/app/services/session/session.service.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../environments/environment';
import { FP } from '@fp-pro/client';

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
    
    console.log("ti= " + sessionStorage.getItem('ti'));
    
    this.dc = new DocumentCapture.Daon.DocumentCapture({
      url: 'https://dobsdemo-docquality-first.identityx-cloud.com/rest/v1/quality/assessments',
      documentType: sessionStorage.getItem('ti'),
      captureInterval: 150
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
   await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({linkedId: this.id});
    if (!(await this.alredySessionExist())) { return; }
    await this.spinner.hide();
    this.filtersLoaded = Promise.resolve(true);

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
    console.log(DocumentCapture);
    await this.spinner.show();

    const { videoWidth, videoHeight } = document.querySelector('video');
    const { clientWidth, clientHeight } = document.querySelector(".ui-canvas-container");
    
    /*export const ID_CARD = { aspectRatio: 1.5858 };
    export const PASSPORT = { aspectRatio: 1.4205 };
    export const A4_PORT = { aspectRatio: 0.7071 };
    export const A4_LAND = { aspectRatio: 1.4143 };*/

    const documentTypeRatio=1.5858;
    console.log("Ratio" + videoHeight/videoWidth);
    const rectCoords = getRectCoordsFromContainer({
      video: {
        x: videoWidth,
        y: videoHeight
      },
      container: {
        x: clientWidth,
        y: clientHeight
      },
      documentTypeRatio
    })
    function getContainerProjection({ ratios, container }) {
      const ratio = Math.min(ratios.x, ratios.y);    
      return {
        x: container.x * ratio,
        y: container.y * ratio
      }
    }
    function getContainerProjectionRatios({ video, container }) {
      return {
        x: video.x / container.x,
        y: video.y / container.y
      }
    }
    function getRectCoordsFromContainer({ video, container, documentTypeRatio }) {
      const ratios = getContainerProjectionRatios({ video, container });
      const pContainer = getContainerProjection({ ratios, container });
      const offset = pContainer.x * 6.25 / 100;
      const width = pContainer.x - offset;
      return {
        upperLeftX: Math.trunc((video.x - pContainer.x) / 2 + offset / 2),
        upperLeftY: Math.trunc((video.y - pContainer.y) / 2 + offset * 2),
        width: Math.trunc(width),
        height: Math.trunc(width / documentTypeRatio)
      }
    }
    console.log("<<>> " + JSON.stringify(rectCoords) +
    this.serviciogeneralService.getFrontAndBack());
  
    this.dc.captureFrame()
      .then(blob => this.dc.assessQuality(blob, rectCoords,
         (this.serviciogeneralService.getFrontAndBack() === 'front')))
      .then(response => this.onServerFeedback(response))
      .catch(async err => {
        this.mensaje = err;
        console.log('err= ' + err);
        await this.spinner.hide();
      });

      /*this.dc.startAutoCapture(
        response => this.onServerFeedback(response),
        blob => this.dc.assessQuality(blob, rectCoords, true),
        async err => {
          this.mensaje = err;
          console.log('err= ' + err);
          await this.spinner.hide();
        });
        */
  }

  async onServerFeedback(response) {
    if (response.result === 'FAIL') {
      this.mensaje = response.feedback;
      console.log('no pasa');
      await this.spinner.hide();
    } else {
      console.log('siii pasa + '  + JSON.stringify(response));
      this.img = 'data:image/jpeg;base64,' + response.responseBase64Image;
      this.dc.stopCamera();
      console.log(this.img);
      this.serviciogeneralService.setImg64(this.img);
      this.serviciogeneralService.setIsUpload(false);
      await this.spinner.hide();
      this.router.navigate([Rutas.documentConfirm + `${this.id}`]);
    }
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
            var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
              len = binStr.length,
              arr = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }
            callback(new Blob([arr], { type: type || 'image/png' }));
          });
        }
      });
    }
  }
}
