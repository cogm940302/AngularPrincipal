import { Component, OnInit } from '@angular/core';
import * as Daonjs from '../../../../assets/js/Daon.FaceCapture.min.js';
import { ShareFaceService } from 'src/app/services/share/share-face.service.js';

@Component({
  selector: 'app-page-face-capture',
  templateUrl: './page-face-capture.component.html',
  styleUrls: ['./page-face-capture.component.css']
})
export class PageFaceCaptureComponent implements OnInit {

  constructor(private share: ShareFaceService) { }

  fc: any;
  videoEl: any;
  algo: any;
  ngOnInit() {
    this.algo = '';
    this.fc = new Daonjs.Daon.FaceCapture({
      url: "https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments"
    });

    this.videoEl = document.querySelector("video");
    this.fc.startCamera(this.videoEl).then((response) => {
      console.log(response);
    });
    console.log(this.fc);
    this.onIniciar();
    this.onSeguir();
  }


  async imprimirImagen() {
    console.log('se supone que si hice algo');
    console.log(this.algo);
    // $("body").append(`<BlobPreview blob=${algo} class="clase" />`);
    this.algo = await this.blobToBase64(this.algo);
    this.share.setFoto(this.algo);
    console.log(this.algo);
  }

  onIniciar() {
    this.fc.onCameraStarted = (fc, video) => {
      video.onloadedmetadata = () => {
        fc.startFaceDetector({
          urlFaceDetectorWasm: "https://dobsdemo-facequality-first.identityx-cloud.com/DaonFaceQualityLite.wasm",
          onFaceDetectorInitialized: () => {
            fc.findFace();
          },
          onFaceDetectorError: (err) => {
            console.error("DEMO FaceDetector error", err)
          },
          onFaceDetection: coords => {
            if (coords) {
              // this.setState({
              //   faceFound: coords
              // });
            } else {
              //call again in half a second
              setTimeout(() => {
                // this.state.fc.findFace();
                console.log('timeout');
              }, 500);
            }
          }
        });
      }
    }
  }
  onSeguir() {
    console.log('Si entre a tomar el video');
    this.videoEl.onloadedmetadata = function () {
      console.log('result');
      console.log(this.fc);
      this.fc.startAutoCapture(response => {
        console.log(response);
        if (response.result === "FAIL") {
          console.log('no pasa');
        } else if (response.result === "PASS") {
          console.log('si pasa');
          this.fc.stopAutoCapture();
          this.algo = response.sentBlobImage;
          console.log('algo');
          console.log(this.algo);
        }
      }, (error) => {
        console.log('error durante la captura');
        console.log(error);
      });
    }
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result.toString().replace("data:image/jpeg;base64,", ""));
        }
      } catch (err) {
        reject(err);
      }
    })
  }


}
