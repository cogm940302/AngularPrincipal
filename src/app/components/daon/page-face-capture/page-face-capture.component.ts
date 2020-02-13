import { Component, OnInit } from '@angular/core';
import * as Daonjs from '../../../../assets/js/Daon.FaceCapture.min.js';

@Component({
  selector: 'app-page-face-capture',
  templateUrl: './page-face-capture.component.html',
  styleUrls: ['./page-face-capture.component.css']
})
export class PageFaceCaptureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let fc = new Daonjs.Daon.FaceCapture({
      url: "https://{urlToFaceQualityService}"
    });
    let videoEl = document.querySelector("video");
    fc.startCamera(videoEl).then((response) => {
      console.log(response);
    });

    console.log('Si entre a esta madre');
    videoEl.onloadedmetadata = function () {
      console.log('result');
      fc.startAutoCapture(response => {
        if (response.result === "FAIL") {
          console.log('no pasa');
        } else if (response.result === "PASS") {
          console.log('si pasa');
        }
      }, (error) => {
        console.log('error durante la captura');
        console.log(error);
      });
    }
  }

}
