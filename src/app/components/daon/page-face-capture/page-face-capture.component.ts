import { Component, OnInit } from '@angular/core';
import * as Daonjs from '../../../../assets/js/Daon.FaceCapture.min.js';
import { ShareFaceService } from 'src/app/services/share/share-face.service.js';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router } from '@angular/router';
import { PruebaService } from 'src/app/services/share/prueba.service.js';

@Component({
  selector: 'app-page-face-capture',
  templateUrl: './page-face-capture.component.html',
  styleUrls: ['./page-face-capture.component.css']
})
export class PageFaceCaptureComponent implements OnInit {

  constructor(private router: Router, private share: PruebaService) { }

  activator = true;
  imageData: any;
  videoEl = document.querySelector('video');
  async ngOnInit() {
    this.imageData = '';
    const fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });
    console.log(this.videoEl);
    fc.startCamera(this.videoEl).then((response) => {
      console.log(response);
    });

    Daonjs.onCameraStarted = (fc, video) => {
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
    };

    this.videoEl.onloadedmetadata = () => {
      console.log('result');
      fc.startAutoCapture(response => {
        console.log(response);
        if (response.result === 'FAIL') {
          console.log('no pasa');
        } else if (response.result === 'PASS') {
          console.log('si pasa');
          fc.stopAutoCapture();
          this.imageData = response.sentBlobImage;
          this.activator = false;
        }
      }, (error) => {
        console.log('error durante la captura');
        console.log(error);
      });
    };

  }


  imprimirImagen() {
    return this.imageData;
  }

}
