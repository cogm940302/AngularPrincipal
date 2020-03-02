import { Component, OnInit } from '@angular/core';
import * as Daonjs from '../../../../assets/js/Daon.FaceCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service.js';
import { Rutas } from 'src/app/model/RutasUtil.js';
// TODO verificar las rutas de los archivos
@Component({
  selector: 'app-page-face-capture',
  templateUrl: './page-face-capture.component.html',
  styleUrls: ['./page-face-capture.component.css']
})
export class PageFaceCaptureComponent implements OnInit {


  constructor(private router: Router, private session: SessionService, private actRoute: ActivatedRoute) {

    this.fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });
  }

  activator = true;
  imageData: any;
  videoEl: any;
  id: string;
  fc: any;

  async ngOnInit() {
    // this.actRoute.params.subscribe(params => {
    //   this.id = params['id'];
    // });
    // if (!this.alredySessionExist()) { return; }

    this.imageData = '';
    this.videoEl = document.querySelector('video');
    console.log(this.videoEl);
    this.fc.startCamera(this.videoEl).then((response) => {
      console.log(response);
    });

    this.videoEl.onloadedmetadata = () => {
      this.fc.startAutoCapture(response => {
        console.log(response);
        if (response.result === 'FAIL') {
          console.log('no pasa');
        } else if (response.result === 'PASS') {
          console.log('si pasa');
          this.fc.stopAutoCapture();
          this.imageData = response.sentBlobImage;
          this.activator = false;
        }
      },
        (error) => {
          console.log('error durante la captura');
          console.log(error);
        });
    };

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
      } else if (object.selfie !== null && object.selfie !== undefined && object.selfie !== '') {
        this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  captura() {
    this.fc.stopAutoCapture();
  }

  onCameraStarted = (fc, video) => {
    video.onloadedmetadata = () => {
      fc.startFaceDetector({
        urlFaceDetectorWasm: 'https://dobsdemo-facequality-first.identityx-cloud.com/DaonFaceQualityLite.wasm',
        onFaceDetectorInitialized: () => {
          fc.findFace();
        },
        onFaceDetectorError: (err) => {
          console.error('DEMO FaceDetector error', err);
        },
        onFaceDetection: coords => {
          if (coords) {
            console.log('las coordenadas son: ');
            console.log(coords);
          } else {
            console.log('volviendo a llamar');
          }
        }
      });
    };
  }

  tomarSelfie() {

  }

  imprimirImagen() {
    return this.imageData;
  }

}
