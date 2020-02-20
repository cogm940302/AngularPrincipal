import { Component, OnInit } from '@angular/core';
import * as Daonjs from '../../../../assets/js/Daon.FaceCapture.min.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-face-capture',
  templateUrl: './page-face-capture.component.html',
  styleUrls: ['./page-face-capture.component.css']
})
export class PageFaceCaptureComponent implements OnInit {

  constructor(private router: Router) {
    this.fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });

  }

  activator = true;
  imageData: any;
  videoEl: any;
  fc: any;

  async ngOnInit() {
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
