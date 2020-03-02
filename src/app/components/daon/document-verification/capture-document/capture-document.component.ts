import { Component, OnInit } from '@angular/core';
import * as DocumentCapture from '../../../../../assets/js/Daon.DocumentCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { SessionService } from 'src/app/services/session/session.service.js';

@Component({
  selector: 'app-capture-document',
  templateUrl: './capture-document.component.html',
})
export class CaptureDocumentComponent implements OnInit {

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService,
              private session: SessionService, private actRoute: ActivatedRoute) {
    if (serviciogeneralService.gettI() !== undefined) {
      sessionStorage.setItem('ti', serviciogeneralService.gettI());
    } else if (sessionStorage.getItem('ti') === undefined) {
      this.router.navigate([Rutas.chooseIdentity]);
    }
    this.fc = new DocumentCapture.Daon.DocumentCapture({
      url: 'https://dobsdemo-docquality-first.identityx-cloud.com/rest/v1/quality/assessments',
      documentType: sessionStorage.getItem('ti'),
    });
  }

  filtersLoaded: Promise<boolean>;
  mensaje: string;
  id: string;
  fc: any;
  img: any;

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!this.alredySessionExist()) { return; }
    this.capturar();
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

  enter() {
    this.fc.capture().then(response => {
      console.log(response);
      if (response.result === 'FAIL') {
        this.mensaje = response.feedback;
        console.log('no pasa');
      } else if (response.result === 'PASS') {
        this.fc.stopAutoCapture();
        this.img = 'data:image/jpeg;base64,' + response.responseBase64Image;
        this.serviciogeneralService.setImg64(this.img);
        this.router.navigate([Rutas.documentConfirm]);
      }
    })
      .catch(err => {
        console.log('err= ' + err);
      });
  }


  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  capturar() {
    this.mensaje = 'Position your document inside the area';
    console.log('captura');
    const videoEl = document.querySelector('video');
    this.fc.startCamera(videoEl).then((response) => {
      console.log(response);
    });
    videoEl.onloadedmetadata = () => {
      console.log('result');
    };

  }

}
