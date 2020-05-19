import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentoSend, ClientCapture, ProcessedImage, SensitiveData, } from '../../../../model/DaonPojos/Documento';
import { CheckID } from '../../../../model/DaonPojos/CheckID';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { MiddleDaonService } from 'src/app/services/http/middle-daon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorSelfieService } from 'src/app/services/errores/error-selfie.service';
import { environment } from '../../../../../environments/environment';
import { FP } from '@fp-pro/client';


@Component({
  selector: 'app-confirm-document',
  templateUrl: './confirm-document.component.html',
})
export class ConfirmDocumentComponent implements OnInit {

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService,
              private session: SessionService, private actRoute: ActivatedRoute, private middleDaon: MiddleDaonService,
              private spinner: NgxSpinnerService, private errorSelfieService: ErrorSelfieService) {
  }

  filtersLoaded: Promise<boolean>;
  documentoSend: DocumentoSend;
  clientCapture: ClientCapture;
  processedImage: ProcessedImage;
  sensitiveData: SensitiveData;
  checkIdsGetSend: any;
  id: string;
  img: any;

  async ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({linkedId: this.id});
    if (!(await this.alredySessionExist())) { return; }
    this.documentoSend = new DocumentoSend();
    this.clientCapture = new ClientCapture();
    this.processedImage = new ProcessedImage();
    this.sensitiveData = new SensitiveData();
    this.checkIdsGetSend = new CheckID();
    this.checkIdsGetSend.url = 'https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAz60XuGXnwddZAHUcgGbFJgA/idchecks';
    this.checkIdsGetSend.metodo = 'GET';
    console.log('>>>>>>>>>>>>>>>>> ' + this.serviciogeneralService.getImg64());
    this.img = this.serviciogeneralService.getImg64();
    this.filtersLoaded = Promise.resolve(true);
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.daon.identity) {
        this.router.navigate([Rutas.livenessInstruction + `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  back() {
    if (this.serviciogeneralService.getIsUpload()) {
      this.router.navigate([Rutas.documentInstruction + `${this.id}`]);
    } else {
      this.router.navigate([Rutas.documentCapture + `${this.id}`]);
    }
  }

  async sendDocumentDaon() {
    const jsonSendFaceDaon = {
      data: this.serviciogeneralService.getImg64().replace('data:image/jpeg;base64,', ''),
    };

    const resultCode = await this.middleDaon.sendInfoDaon(jsonSendFaceDaon, this.id, 'document');
    if (resultCode !== 200) {
      console.log('ocurrio un error, favor de reintentar');
      this.errorSelfieService.mensaje = 'Error, favor de volver a intentar';
      this.router.navigate([Rutas.documentInstruction + `${this.id}`]);
      return false;
    }
    return true;
  }

  async continue() {
    await this.spinner.show();
    console.log('voy a enviar');
    if (await this.sendDocumentDaon()) {
      if ( (sessionStorage.getItem('ti') && sessionStorage.getItem('ti') !== 'ID_CARD')
      || (this.serviciogeneralService.getFrontAndBack() === 'back' || sessionStorage.getItem('fb') === 'back')) {
        // const object = this.session.getObjectSession();
        // object.daon.identity = true;
        // this.session.updateModel(object);
        // await this.middleDaon.updateDaonDataUser(object, this.id);
        // console.log('ya termine' + JSON.stringify(object, null, 2));
        this.router.navigate([Rutas.ocrValidation + `${this.id}`]);
      } else if (this.serviciogeneralService.getFrontAndBack() === 'front' || sessionStorage.getItem('fb') === 'front') {
        this.serviciogeneralService.setFrontAndBack('back');
        this.router.navigate([Rutas.documentInstruction + `${this.id}`]);
        await this.spinner.hide();
      }
    }
  }

}
