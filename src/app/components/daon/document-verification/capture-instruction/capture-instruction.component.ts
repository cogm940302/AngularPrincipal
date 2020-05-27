import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DocumentCapture from '../../../../../assets/js/Daon.DocumentCapture.min.js';
import IconDefinitions from '../../../../../assets/icons/icons-svn';
import { ErrorSelfieService } from 'src/app/services/errores/error-selfie.service';
import { environment } from '../../../../../environments/environment';
import { FP } from '@fp-pro/client';

@Component({
  selector: 'app-capture-instruction',
  templateUrl: './capture-instruction.component.html',
  styleUrls: ['./capture-instruction.component.css']
})
export class CaptureInstructionComponent implements OnInit {

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService, private actRoute: ActivatedRoute,
              private session: SessionService, private spinner: NgxSpinnerService, private errorSelfieService: ErrorSelfieService) {
    if (serviciogeneralService.gettI() !== undefined &&
     serviciogeneralService.getFrontAndBack() !== undefined) {

      sessionStorage.setItem('ti', serviciogeneralService.gettI());
      sessionStorage.setItem('fb', serviciogeneralService.getFrontAndBack());
      
      if (serviciogeneralService.getFrontAndBack() === 'front') { 
        this.titulo = 'Identificación de frente';
        if (serviciogeneralService.gettI() === 'ID_CARD') {
        this.idcard = 'id-card-front sv';
        } else {
        this.idcard = 'passport';
        } 
      } else {
        this.titulo = 'Identificación de posterior';
        this.idcard = 'id-card-back';
      }
    } else if (sessionStorage.getItem('ti') === undefined ||
     sessionStorage.getItem('fb') === undefined) {
      this.router.navigate(['']);
    } else {
      
      if (sessionStorage.getItem('fb') === 'front') {
        this.titulo = 'Identificación de frente';
        if (sessionStorage.getItem('ti') === 'ID_CARD') {
        this.idcard = 'id-card-front ss';
        } else {
         this.idcard = 'passport';
        }
      } else {
        this.titulo = 'Identificación de posterior';
        this.idcard = 'id-card-back';
      }
    }

    this.dc = new DocumentCapture.Daon.DocumentCapture({
      url: 'https://dobsdemo-docquality-first.identityx-cloud.com/rest/v1/quality/assessments',
      documentType: sessionStorage.getItem('ti'),
    });

  }

  errorMensaje: string;
  titulo: string;
  id: string;
  dc: any;
  mensaje: string;
  img: any;
  idcard: any;
  icon: IconDefinitions;

  async ngOnInit() {
    await this.spinner.show();
    this.errorMensaje = this.errorSelfieService.returnMensaje();
    console.log('titulo= ' + this.titulo);
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({ "tag" : this.id});
    if (! (await this.alredySessionExist())) { return; }
    await this.spinner.hide();
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
    this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
  }

  captueWCamera() {
    this.router.navigate([Rutas.documentCapture + `${this.id}`]);
  }

  async processFile(imageInput: any) {
    await this.spinner.show();
    this.mensaje = '';
    const file: File = imageInput.files[0];
    console.log(file);
    this.dc.assessQuality(file)
    .then( async response => {
      if (response.result === 'FAIL') {
        this.titulo="Error en el documento";
        this.mensaje = response.feedback;
        console.log(this.mensaje);
        console.log('no pasa');
        await this.spinner.hide();
      } else if (response.result === 'PASS') {
        this.dc.stopCamera();
        this.dc.stopAutoCapture();
        this.img = 'data:image/jpeg;base64,' + response.responseBase64Image;
        this.serviciogeneralService.setImg64(this.img);
        this.serviciogeneralService.setIsUpload(true);
        
        await this.spinner.hide();
        this.router.navigate([Rutas.documentConfirm + `${this.id}`]);
      }
    })
    .catch( async err => {
      console.log('err= ' + err);
      this.titulo="Error en el documento";
      this.mensaje="Imagen no permitida";
      await this.spinner.hide();
    });
  }

}


