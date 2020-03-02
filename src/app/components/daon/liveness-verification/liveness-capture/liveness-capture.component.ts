import { Component, OnInit } from '@angular/core';
import * as FaceLineness3D from "../../../../../assets/js/Daon.FaceLiveness3D.min.js";
import { CheckID } from "../../../../model/DaonPojos/CheckID";
import { ServicesGeneralService } from  "../../../../services/general/services-general.service";
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-liveness-capture',
  templateUrl: './liveness-capture.component.html',
  
})
export class LivenessCaptureComponent implements OnInit {
  instTxt:any;
  blnStart:boolean;
  checkIdsGetSend:any;
  constructor(public serviciogeneralService:ServicesGeneralService,public router: Router) { }

  ngOnInit() {
    this.blnStart=false;
    this.capturar();
    this.checkIdsGetSend = new CheckID(); 
    this.checkIdsGetSend.url="https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAzIE8VTyefK9Vm5yhO9gzQgQ/idchecks";
    this.checkIdsGetSend.metodo="GET";
  }

  getChecksID(value){
    this.serviciogeneralService.sendDaon(this.checkIdsGetSend).subscribe(data => {
      console.log(JSON.stringify(data, null, 2));
       if (data.errorType) {
         console.log("errorType= " + JSON.stringify(data, null, 2));
       } else {
        console.log("link pa el video= " + JSON.stringify(data.body.items[0].videos.href, null, 2));
        this.sendLivenessDaon(data.body.items[0].videos.href,value);
       }
     });
  }

  sendLivenessDaon(href,value){
    let jsonvideo =  {
      "url":href,
      "metodo":"POST",
      "subtype": "SVR3DFL_CHALLENGE",
      "captured": new Date().toISOString(),
      "videoFormat": "SVR3DFL",   
      "challenges": [     {
      "challenge": {
        "id": "J9b7Y7S9Q1BAJ3AWizwhhg",
        "type": "SVR3DFL"       
      },
      "start": 0,
      "completed": 99999     
      }   ],
      "sensitiveData": {
        "format": "SVR3DFL",
        "value": value   }
    };
    console.log("jsonvideo= " + JSON.stringify(jsonvideo, null, 2));
    this.serviciogeneralService.sendDaon(jsonvideo).subscribe(data => {
       if (data.errorType) {
         console.log("errorType= " + JSON.stringify(data, null, 2));
       } else {
        console.log("link data= " + JSON.stringify(data, null, 2));
        
        if(data.statusCode=="200")
        {
          //if(data.body.processingStatus != "FAILED"){
            this.serviciogeneralService.setResultLiveness(data.body.processingStatus);
            this.serviciogeneralService.setMensaje(data.body.processingErrors.items[0].message);
            this.router.navigate([Rutas.livenessResult+"/5e559f279279300008700482"]);
          //}
        }else if(data.statusCode=="400"){
          this.serviciogeneralService.setResultLiveness(data.body.name);
            this.serviciogeneralService.setMensaje(data.body.message);
            this.router.navigate([Rutas.livenessResult+"/5e559f279279300008700482"]);
        }
       }
     });
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  startButton() {
    
  }

  instructions = document.querySelector('#instructions');
  capturar() {
    const videoEl = document.querySelector("video");
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user' } }).then(stream => { videoEl.srcObject = stream; }).catch(error => { console.error('Cannot get camera feed', error); alert('Unable to get hold of your camera.\nPlease ensure no other page/app is using it and reload.'); });


    let FonTemplateCreated = (tpl) => {
      //console.log( tpl);

      const base64template = this.arrayBufferToBase64(tpl);
      //this.props.challengeTemplateUpload(base64template).catch(err => new Error(err));
      console.log("<<<<<<<<<<<<<>>>>>>>>>>>>>>><<<<<<<<<<<<<<" + base64template);
      this.getChecksID(base64template);
     };

    let onUpdate = ((updateType, additional_data) => {
      const TYPES = FaceLineness3D.Daon.FaceLiveness3D.UPDATE_TYPES;
      switch (updateType) {
        case TYPES.ERROR:
          if (additional_data) {
            alert('3DFL returned an error: ' + additional_data);
          } else {
            alert('3DFL returned an error.');
          } 
          break;
        case TYPES.READY: this.instTxt = 'Please center your face so it fills the guide.'; break;
        case TYPES.AWAIT_RESULTS: this.instTxt = 'Please wait for the result. On slow devices it can take a few seconds.'; break;
        case TYPES.END_CAPTURE: this.instTxt = ''; break;
        case TYPES.NOT_CENTERED: this.instTxt = 'Center Face'; break;
        case TYPES.TOO_FAR: this.instTxt = 'Too Far'; break;
        case TYPES.TOO_CLOSE: this.instTxt = 'Too Close'; break;
        //case TYPES.HOLD: outlineImage = outlineImageGreen;

        //Rerenders the face placeholder oval in green, since face is placed 

        //Starts face placeholder oval animation.        //Source code ommited due to brewity       
        //startAnimation();
        //      break;     
        case TYPES.FACE_BOX:       //Face detection occured, `additional_data` contains face coordinates       
          break;
      }
    });

    const DaonFaceQualityLiteWasm = window.location.origin + '/assets/js/DaonFaceQualityLite.wasm';
    let f3d = new FaceLineness3D.Daon.FaceLiveness3D(DaonFaceQualityLiteWasm);
    videoEl.onloadedmetadata =  function () {
      videoEl.play();
      const config = {
        video: videoEl,
        onUpdate: onUpdate,
        onTemplateCreated: FonTemplateCreated,
        movementDelay: 1250
      };
      f3d.initialize(config);
      f3d.startProcessing();
      setTimeout(() => f3d.startSession(), 500);
    }
    
  }


}
