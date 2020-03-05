import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentoSend, ClientCapture, ProcessedImage, SensitiveData, } from '../../../../model/DaonPojos/Documento';
import { CheckID } from '../../../../model/DaonPojos/CheckID';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';


@Component({
  selector: 'app-confirm-document',
  templateUrl: './confirm-document.component.html',
})
export class ConfirmDocumentComponent implements OnInit {

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService,
              private session: SessionService, private actRoute: ActivatedRoute) {
  }

  filtersLoaded: Promise<boolean>;
  documentoSend: DocumentoSend;
  clientCapture: ClientCapture;
  processedImage: ProcessedImage;
  sensitiveData: SensitiveData;
  checkIdsGetSend: any;
  id: string;
  img: any;

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    // if (!this.alredySessionExist()) { return; }
    this.documentoSend = new DocumentoSend();
    this.clientCapture= new ClientCapture();
    this.processedImage=new ProcessedImage();
    this.sensitiveData=new SensitiveData();
    this.checkIdsGetSend = new CheckID();
    this.checkIdsGetSend.url="https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAz60XuGXnwddZAHUcgGbFJgA/idchecks";
    this.checkIdsGetSend.metodo="GET";
    console.log(">>>>>>>>>>>>>>>>> "+this.serviciogeneralService.getImg64());

    this.img = this.serviciogeneralService.getImg64();
    this.filtersLoaded = Promise.resolve(true);
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.identity !== null && object.identity !== undefined && object.identity !== '') {
        this.router.navigate([Rutas.livenessInstruction + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  back() {
    this.router.navigate([Rutas.documentCapture + `${this.id}`]);
  }

  sendDocumentDaon(url) {
console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    this.documentoSend.captured = new Date().toISOString();
    this.documentoSend.url = url;
    this.documentoSend.metodo = 'POST';
    this.documentoSend.clientCapture = this.clientCapture;
    this.documentoSend.clientCapture.processedImage = this.processedImage;
    this.sensitiveData.imageFormat = 'jpg';
    this.sensitiveData.value = this.serviciogeneralService.getImg64().replace('data:image/jpeg;base64,', '');
    this.documentoSend.clientCapture.processedImage.sensitiveData = this.sensitiveData;
    console.log("documentoSend= " + JSON.stringify(  this.documentoSend, null, 2));
    this.serviciogeneralService.sendDaon(this.documentoSend).subscribe(data => {
      console.log(JSON.stringify(data, null, 2));
      if (data.errorType) {

      } else {
        console.log("this.serviciogeneralService.getFrontAndBack() = " + this.serviciogeneralService.getFrontAndBack());
        // this.serviciogeneralService.settI("this.typeIdentity");
        if (this.serviciogeneralService.getFrontAndBack() === 'front') {
          this.serviciogeneralService.setFrontAndBack('back');
          this.router.navigate([Rutas.documentInstruction+ `${this.id}`]);
        } else if (this.serviciogeneralService.getFrontAndBack() === 'back') {
          this.router.navigate([Rutas.livenessInstruction+ `${this.id}`]);
        }
      }
    });

    console.log('============= ' + JSON.stringify(this.documentoSend, null, 2));
  }
  continue() {
    this.serviciogeneralService.sendDaon(this.checkIdsGetSend).subscribe(data => {
      console.log(JSON.stringify(data, null, 2));
      if (data.errorType) {
        console.log('errorType= ' + JSON.stringify(data, null, 2));
      } else {
        console.log('link pa el doc= ' + JSON.stringify(data.body.items[0].documents.href, null, 2));
        this.sendDocumentDaon(data.body.items[0].documents.href);

      }
    });
  }

}
