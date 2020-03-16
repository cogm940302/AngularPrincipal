import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DocumentCapture from '../../../../../assets/js/Daon.DocumentCapture.min.js';
import IconDefinitions from '../../../../../assets/icons/icons-svn';
@Component({
  selector: 'app-capture-instruction',
  templateUrl: './capture-instruction.component.html',
  styleUrls: ['./capture-instruction.component.css']
})
export class CaptureInstructionComponent implements OnInit {

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService, private actRoute: ActivatedRoute,
              private session: SessionService, private spinner: NgxSpinnerService) {
    if (serviciogeneralService.gettI() !== undefined && serviciogeneralService.getFrontAndBack() !== undefined) {
      sessionStorage.setItem('ti', serviciogeneralService.gettI());
      sessionStorage.setItem('fb', serviciogeneralService.getFrontAndBack());
      this.titulo = serviciogeneralService.gettI() + ' 1photo page ' + serviciogeneralService.getFrontAndBack();
    } else if (sessionStorage.getItem('ti') === undefined || sessionStorage.getItem('fb') === undefined) {
      this.router.navigate(['']);
    } else {
      this.titulo = sessionStorage.getItem('ti') + ' 2photo page ' + sessionStorage.getItem('fb');
    }

    this.dc = new DocumentCapture.Daon.DocumentCapture({
      url: 'https://dobsdemo-docquality-first.identityx-cloud.com/rest/v1/quality/assessments',
      documentType: 'ID_CARD'//sessionStorage.getItem('ti'),
    });

  }

  titulo: string;
  id: string;
  dc: any;
  mensaje: string;
  img: any;
  icon:IconDefinitions;

  async ngOnInit() {
    await this.spinner.show();
    console.log('titulo= ' + this.titulo);
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!this.alredySessionExist()) { return; }
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

  processFile(imageInput: any) {
    this.mensaje="";
    const file: File = imageInput.files[0];
    console.log(file);
    this.dc.assessQuality(file)
    .then( response => {
      if (response.result === 'FAIL') {
        this.mensaje = response.feedback;
        console.log(this.mensaje);
        console.log('no pasa');
      } else if (response.result === 'PASS') {
        this.dc.stopCamera();
        this.dc.stopAutoCapture();
        this.img = 'data:image/jpeg;base64,' + response.responseBase64Image;
        this.serviciogeneralService.setImg64(this.img);
        this.serviciogeneralService.setIsUpload(true);
        this.router.navigate([Rutas.documentConfirm+ `${this.id}`]);
      }
    })
    .catch( err => {
      console.log('err= ' + err);
    });


  }

}


