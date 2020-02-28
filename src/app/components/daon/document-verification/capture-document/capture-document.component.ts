import { Component, OnInit } from '@angular/core';
import * as DocumentCapture from "../../../../../assets/js/Daon.DocumentCapture.min.js";
import { Router } from '@angular/router';
import { ServicesGeneralService } from  "../../../../services/general/services-general.service";

@Component({
  selector: 'app-capture-document',
  templateUrl: './capture-document.component.html',
})
export class CaptureDocumentComponent implements OnInit {

  fc:any;
  img:any;
  mensaje:string;
  constructor(public router:Router, public serviciogeneralService:ServicesGeneralService) { 
    if(serviciogeneralService.gettI()!=undefined){
      sessionStorage.setItem("ti", serviciogeneralService.gettI());
    }else if (sessionStorage.getItem('ti') == undefined){
      this.router.navigate(['']);
    }
    
    this.fc = new DocumentCapture.Daon.DocumentCapture({                                                
      url: "https://dobsdemo-docquality-first.identityx-cloud.com/rest/v1/quality/assessments",
      documentType: sessionStorage.getItem('ti'),
    });
    
  }
  ngOnInit() {
    this.capturar();
    
  }

  enter2(){
    this.router.navigate(['/cd'])
  }

  enter(){
    this.fc.capture().then(response=>{
      console.log(response);
    if (response.result === "FAIL") {
      this.mensaje= response.feedback;
      console.log('no pasa');
    } else if (response.result === "PASS") {
      this.fc.stopAutoCapture();
      this.img="data:image/jpeg;base64,"+response.responseBase64Image;
      this.serviciogeneralService.setImg64(this.img);
      this.router.navigate(['/services/document/confirm']);
      // this.blobToBase64(this.img).then(data => {
      //   this.img = data;
      //   console.log("img= " + this.img);
      // })
      // .catch((err) => {
      //     console.log("err= " + err);
      // });    

      //this.img = response.responseBase64Image;
    }
  })
  .catch(err=>{
    console.log("err= " + err);
  });
}

    
blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    try {
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      }
    } catch (err) {
      reject(err);
    }
  })
}

capturar(){ 
  this.mensaje="Position your document inside the area";
  console.log("captura");
     const videoEl = document.querySelector("video");
     this.fc.startCamera(videoEl).then((response) => {
       console.log(response);
     });
    videoEl.onloadedmetadata = function() {
      console.log('result');
    }

  }

}
