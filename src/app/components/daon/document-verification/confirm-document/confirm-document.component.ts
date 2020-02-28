import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from  "../../../../services/general/services-general.service";
import { Router } from '@angular/router';
import { DocumentoSend,ClientCapture, ProcessedImage, SensitiveData,  } from "../../../../model/DaonPojos/Documento";
import { CheckID } from "../../../../model/DaonPojos/CheckID";


@Component({
  selector: 'app-confirm-document',
  templateUrl: './confirm-document.component.html',
})
export class ConfirmDocumentComponent implements OnInit {
  img:any;
  documentoSend:DocumentoSend;
  clientCapture:ClientCapture;
  processedImage:ProcessedImage;
  sensitiveData:SensitiveData;

  checkIdsGetSend:any;
  constructor( public router:Router, public serviciogeneralService:ServicesGeneralService) {
  }
  
  ngOnInit() {
    this.documentoSend = new DocumentoSend();
    this.clientCapture= new ClientCapture();
    this.processedImage=new ProcessedImage();
    this.sensitiveData=new SensitiveData();
    this.checkIdsGetSend = new CheckID();
    console.log(">>>>>>>>>>>>>>>>> "+this.serviciogeneralService.getImg64());

    
    this.checkIdsGetSend.url="https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAzsec8ROKMltj4m8cTU5EJpQ/idchecks";
    this.checkIdsGetSend.metodo="GET";

    this.img=this.serviciogeneralService.getImg64();
  }

  back(){
    this.router.navigate(['/services/document/capture']);
  }

  sendDocumentDaon(url){
    
    this.documentoSend.captured="2019-06-26T13:56:16.230Z";
    this.documentoSend.url=url;
    this.documentoSend.metodo="POST";
    this.documentoSend.clientCapture=this.clientCapture;
    this.documentoSend.clientCapture.processedImage=this.processedImage;
    this.sensitiveData.imageFormat="jpg";
    this.sensitiveData.value=this.serviciogeneralService.getImg64().replace("data:image/jpeg;base64,", "");
    this.documentoSend.clientCapture.processedImage.sensitiveData=this.sensitiveData;
    
    this.serviciogeneralService.sendDaon(this.documentoSend).subscribe(data => {
      console.log(JSON.stringify(data, null, 2));
       if (data.errorType) {
        
       } else {
        //this.serviciogeneralService.settI("this.typeIdentity");
          if(this.serviciogeneralService.getFrontAndBack()=="front"){
          this.serviciogeneralService.setFrontAndBack("back");
          this.router.navigate(['/services/document/instruction']);
          }else if(this.serviciogeneralService.getFrontAndBack()=="back"){
            this.router.navigate(['/services/liveness/instruction']);
          }
       }
     });
    
    console.log("============= " + JSON.stringify(this.documentoSend, null, 2));
  }
  continue(){
  this.serviciogeneralService.sendDaon(this.checkIdsGetSend).subscribe(data => {
    console.log(JSON.stringify(data, null, 2));
     if (data.errorType) {
       console.log("errorType= " + JSON.stringify(data, null, 2));
     } else {
      console.log("link pa el doc= " + JSON.stringify(data.body.items[0].documents.href, null, 2));
      this.sendDocumentDaon(data.body.items[0].documents.href);

     }
   });
 }

}
