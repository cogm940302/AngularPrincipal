import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from '../../model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { MiddleDaonService } from 'src/app/services/http/middle-daon.service';
import { sesionModel } from '../../model/sesion/SessionPojo';
import { MiddleMongoService } from '../../services/http/middle-mongo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MiddleVerificacionService } from '../../services/http/middle-verificacion.service';

@Component({
  selector: 'app-correo-verificacion',
  templateUrl: './correo-verificacion.component.html',
  styleUrls: ['./correo-verificacion.component.css']
})
export class CorreoVerificacionComponent implements OnInit {

  constructor(private router: Router, private session: SessionService,
              private actRoute: ActivatedRoute, private middleDaon: MiddleDaonService,
              private middleMongo: MiddleMongoService, private spinner: NgxSpinnerService,
              private middleVerifica: MiddleVerificacionService) { }

  filtersLoaded: Promise<boolean>;
  validationResult = 'false';
  validEmailField = false;
  object: sesionModel;
  correoText = '';
  error = '';
  id: any;

  async ngOnInit() {
    await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!await this.alredySessionExist()) { return; }
    this.filtersLoaded = Promise.resolve(true);
    await this.spinner.hide();
  }

  async alredySessionExist() {
    this.object = this.session.getObjectSession();
    console.log(this.object);
    if (this.object === null || this.object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      if (this.object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (this.object.correo !== null && this.object.correo !== undefined && this.object.correo) {
        console.log('voy a instrucciones');
        this.router.navigate([Rutas.instrucciones + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  reciveResultFromValidate(event) {
    this.spinner.show();
    this.validationResult = event;
    if (event === 'OK') {
      this.error = '';
      this.object['emailVerified'] = true;
      console.log('si cambie los valores');
      // this.verificaCorreo();
      this.spinner.hide();
    } else {
      this.error = 'El codigo es incorrecto';
      this.spinner.hide();
    }
  }

  onSearchChange(searchValue: string): void {
    this.correoText = searchValue;
  }

  changeEmail() {
    this.validEmailField = false;
  }

  verifyEmail() {
      this.validEmailField = true;
  }

  async aceptar() {
    await this.spinner.show();
    if (this.object['emailVerified'] === false) {
      this.validEmailField = true;
      await this.middleVerifica.generaCodigoEmail(this.id, this.correoText);
      this.error = 'Hemos enviado un correo de verificación al correo indicado, favor de ingresarlo';
      await this.spinner.hide();
    } else {
      console.log('no entre');
      // this.verificaCorreo();
      await this.spinner.hide();
    }
  }

  async verificaCorreo() {
    const objetoDaon = await this.middleDaon.createDaonRegister(this.correoText, this.id);
    if (objetoDaon === true) {
      this.object.correo = true;
      this.session.updateModel(this.object);
      await this.middleDaon.updateDaonDataUser(this.object, this.id);
      this.router.navigate([Rutas.instrucciones + `${this.id}`]);
    } else {
      this.router.navigate([Rutas.error]);
    }
    await this.spinner.hide();
  }
}
