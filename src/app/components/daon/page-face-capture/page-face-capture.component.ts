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

  // fc: any;
  activator = true;
  // videoEl: any;
  imageData: any;
  async ngOnInit() {
    this.imageData = '';
    const fc = new Daonjs.Daon.FaceCapture({
      url: "https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments"
    });
    const videoEl = document.querySelector("video");
    console.log(videoEl);
    fc.startCamera(videoEl).then((response) => {
      console.log(response);
    });

    Daonjs.onCameraStarted = (fc, video) => {
      video.onloadedmetadata = () => {
        fc.startFaceDetector({
          urlFaceDetectorWasm: "https://dobsdemo-facequality-first.identityx-cloud.com/DaonFaceQualityLite.wasm",
          onFaceDetectorInitialized: function () {
            fc.findFace();
          },
          onFaceDetectorError: function (err) {
            console.error("DEMO FaceDetector error", err)
          },
          onFaceDetection: coords => {
            if (coords) {
            } else {
              //call again in half a second
            }
          }
        });
      };
    };

    videoEl.onloadedmetadata = () => {
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
          // console.log('algo');
          // console.log(algo);
        }
      }, (error) => {
        console.log('error durante la captura');
        console.log(error);
      });
    }


  }


  async imprimirImagen() {
    console.log('se supone que si hice algo');
    // console.log(this.imageData);
    // $("body").append(`<BlobPreview blob=${algo} class="clase" />`);
    console.log(this.imageData);
    // this.imageData = await this.blobToBase64(this.imageData);
    // $('body').append(`<img src="data:image/png;base64, ${this.imageData}" alt="Red dot" />`);
    // this.router.navigate([Rutas.selfieVerification]);

  }


  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result.toString().replace('data:image/jpeg;base64,', ''));
        };
      } catch (err) {
        reject(err);
      }
    });
  }


}
