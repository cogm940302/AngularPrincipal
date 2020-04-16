
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Daonjs from '../../../../../assets/js/Daon.FaceCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service.js';
import { ServicesGeneralService, isMobile, isIphone } from '../../../../services/general/services-general.service';
import { Rutas } from 'src/app/model/RutasUtil.js';


// TODO verificar las rutas de los archivos
@Component({
  selector: 'app-page-face-capture',
  templateUrl: './page-face-capture.component.html',
  styleUrls: ['./page-face-capture.component.css']
})
export class PageFaceCaptureComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  isMobileBool: boolean;
  isIphone: boolean;
  activator = true;
  imageGreen: any;
  mensaje: string;
  isEdge: boolean;
  imageData: any;
  btnB: boolean;
  videoEl: any;
  id: string;
  img: any;
  fc: any;

  constructor(private router: Router, private session: SessionService, private actRoute: ActivatedRoute,
              public serviciogeneralService: ServicesGeneralService) {
    this.htmlCanvasToBlob();
    this.fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });

  }

  async ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!this.alredySessionExist()) { return; }
    this.isMobileBool = isMobile(navigator.userAgent);
    this.isIphone = isIphone(navigator.userAgent);
    this.isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
    if (this.isEdge) {
      this.drawOutline(document.getElementById('scream'));
    }
    this.btnB = true;
    this.mensaje = 'Posiciona tu cara dentro del area marcada';
    this.imageData = '';
    this.videoEl = document.querySelector('video');
    this.fc.startCamera(this.videoEl).then((response) => {
      this.onCameraStarted(this.fc, this.videoEl);
    });
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos + `${this.id}`]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.daon.selfie) {
        this.router.navigate([Rutas.chooseIdentity + `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  captura() {
    console.log();
    this.fc.stopAutoCapture();
  }

  onCameraStarted = (fc, video) => {
    video.onloadedmetadata = () => {
      fc.startFaceDetector({
        urlFaceDetectorWasm: window.location.origin + '/assets/js/DaonFaceQualityLite.wasm',
        onFaceDetectorInitialized: () => {
          fc.findFace();
        },
        onFaceDetectorError: (err) => {
          console.error('DEMO FaceDetector error', err);
        },
        onFaceDetection: coords => {
          if (coords) {

          } else {
          }
        }
      });
    };
  }
  returnId() {
    return this.id;
  }
  tomarSelfie() {
    this.btnB = false;
    this.fc.startAutoCapture(response => {
      if (response.result === 'FAIL') {
        this.mensaje = response.feedback;
        console.log('no pasa');
      } else if (response.result === 'PASS') {
        this.serviciogeneralService.setIsCamNative(false);
        console.log('si pasa' + JSON.stringify(response, null, 2));
        this.mensaje = response.feedback;
        this.fc.stopAutoCapture();
        this.imageData = response.sentBlobImage;
        this.serviciogeneralService.setImg64(this.imageData);
        this.router.navigate([Rutas.selfieVerification + `${this.id}`]);
        this.activator = false;
      }
    },
      (error) => {
        console.log('error durante la captura');
        this.mensaje = error;
        console.log(error);
        this.btnB = true;
      });
  }

  imprimirImagen() {
    return this.imageData;
  }

  drawOutline(img) {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const scale = 0.48;
    const dx = (this.canvas.nativeElement.width - img.width * scale) / 2;
    const dy = (this.canvas.nativeElement.height - img.height * scale * 3.5) / 2;
    this.ctx.globalAlpha = 0.7;
    this.ctx.drawImage(img, dx, dy,
      img.width * scale,
      img.height * scale * 3.5);
  }

  htmlCanvasToBlob() {
    if (!HTMLCanvasElement.prototype.toBlob) {
      console.log('HTMLCanvasElement.prototype.toBlob 1 ' + HTMLCanvasElement.prototype.toBlob);
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
          var canvas = this;
          setTimeout(function () {
            var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
              len = binStr.length,
              arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }
            callback(new Blob([arr], { type: type || 'image/png' }));
          });
        }
      });
    }
  }

  processFile(imageInput: any) {
    this.mensaje = '';
    const file: File = imageInput.files[0];
    console.log(file.type);
    if (file.type.toUpperCase().includes('JPG'.toUpperCase()) || file.type.toUpperCase().includes('JPEG'.toUpperCase())) {
      this.fc.assessQuality(file)
        .then(response => {
          if (response.result === 'FAIL') {
            this.mensaje = response.feedback;
            console.log('no pasa');
          } else if (response.result === 'PASS') {
            console.log('si pasa' + JSON.stringify(response, null, 2));
            this.mensaje = response.feedback;
            this.fc.stopAutoCapture();
            this.imageData = response.sentBlobImage;
            this.serviciogeneralService.setImg64(this.imageData);
            this.router.navigate([Rutas.selfieVerification + `${this.id}`]);
            this.activator = false;
          }
        })
        .catch(err => {
          this.mensaje = 'No es una fotografia valida';
          console.log(err);
          this.btnB = true;
        });
    } else {
      this.mensaje = 'La extencion ' + file.type.substr(6) + ' es incorrecta';
    }
  }


}
