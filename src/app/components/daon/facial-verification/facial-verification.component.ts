import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from '../../../model/RutasUtil';
import { catchError } from 'rxjs/operators';
import { SelfieSend } from 'src/app/model/DaonPojos/Selfie';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { SessionService } from 'src/app/services/session/session.service';
import { MiddleMongoService } from '../../../services/http/middle-mongo.service';
import { ServicesGeneralService, isMobile, isAndroid } from '../../../services/general/services-general.service';
import { MiddleDaonService } from '../../../services/http/middle-daon.service';
import { ErrorSelfieService } from 'src/app/services/errores/error-selfie.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-facial-verification',
  templateUrl: './facial-verification.component.html',
  styleUrls: ['./facial-verification.component.css']
})

export class FacialVerificationComponent implements OnInit {
  constructor(public serviciogeneralService: ServicesGeneralService, private router: Router,
              private http: HttpClient, private session: SessionService, private actRoute: ActivatedRoute,
              private mongoMid: MiddleMongoService, private middleDaon: MiddleDaonService,
              private errorSelfieService: ErrorSelfieService, private spinner: NgxSpinnerService) { }

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private data: SelfieSend;
  filtersLoaded: Promise<boolean>;
  @Input() public id: string;
  @Input() public foto: any;
  error: any;
  isMobileBool: boolean;
  isEdge: boolean;
  isAndroid: boolean;
  isNative: boolean;
  img: any;
  async ngOnInit() {
    // console.log(this.foto);
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.img = this.serviciogeneralService.getImg64();
    console.log('img = ' + this.img);
    this.foto = await this.blobToBase64(this.img);
    console.log('Foto= ' + this.foto);
    this.filtersLoaded = Promise.resolve(true);
    this.isMobileBool = isMobile(navigator.userAgent);
    this.isAndroid = isAndroid(navigator.userAgent);
    this.isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
    this.isNative = this.serviciogeneralService.getIsCamNative();
    this.img = this.serviciogeneralService.getImg64();
  }

  async enviar() {
    const jsonSendFaceDaon = {
      data: this.foto,
    };

    const resultCode = await this.middleDaon.sendSelfieDaon(jsonSendFaceDaon, this.id);
    if (resultCode !== 200) {
      console.log('ocurrio un error, favor de reintentar');
      console.log('voy a redirigir a : ' + Rutas.selfie + `${this.id}` );
      this.errorSelfieService.mensaje = 'Error, favor de volver a intentar';
      this.router.navigate([Rutas.instrucciones + `${this.id}`]);
      return false;
    }
    return true;
  }

  async guardar() {
    await this.spinner.show();
    console.log('voy a enviar');
    if (await this.enviar()) {
      const object = this.session.getObjectSession();
      object.daon.selfie = true;
      this.session.updateModel(object);
      await this.middleDaon.updateDaonDataUser(object, this.id);
      console.log('ya termine' + JSON.stringify(object, null, 2));
      this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
    }
    await this.spinner.hide();
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result.toString().replace('data:image/jpeg;base64,', ''));
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  back() {
    this.router.navigate([Rutas.selfie + `${this.id}`]);
  }


}
