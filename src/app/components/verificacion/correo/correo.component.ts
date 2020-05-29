import { Component, OnInit, Output, EventEmitter, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { MiddleVerificacionService } from 'src/app/services/http/middle-verificacion.service';
import { MiddleDaonService } from 'src/app/services/http/middle-daon.service';
import { sesionModel } from '../../../model/sesion/SessionPojo';
import { SessionService } from '../../../services/session/session.service';
import { Rutas } from '../../../model/RutasUtil';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesGeneralService } from '../../../services/general/services-general.service';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

  constructor(public serviciogeneralService: ServicesGeneralService,
              private actRoute: ActivatedRoute, private spinner: NgxSpinnerService,
              private router: Router, private middleVerifica: MiddleVerificacionService, private middleDaon: MiddleDaonService,
              private session: SessionService) {
     }

  filtersLoaded: Promise<boolean>;
  codigoText = '';
  error = '';
  id: any;
  object: sesionModel;
  a = ''; b = ''; c = ''; d = '';
  @ViewChild('box2', { read: false, static: false }) box2: ElementRef;
  @ViewChild('box3', { read: false, static: false }) box3: ElementRef;
  @ViewChild('box4', { read: false, static: false }) box4: ElementRef;
  @ViewChild('validarBoton', { read: false, static: false }) validarBoton: ElementRef;

  async ngOnInit() {
    //var correoText = $('#emailText').text();
    //var res = correoText.replace(/mail|ook/gi, "****");
    //$('#emailText').text(res);
    await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    if(this.serviciogeneralService.getCorreo() === undefined || this.serviciogeneralService.getCorreo() === ''){
      this.router.navigate([Rutas.correo + `${this.id}`]);
    }

    if (!await this.alredySessionExist()) { return; }
    this.filtersLoaded = Promise.resolve(true);
    await this.spinner.hide();
  }

  async alredySessionExist() {
    this.object = this.session.getObjectSession();
    console.log('***object***');
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
        this.router.navigate([Rutas.telefono + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }
  onSearchChange1(searchValue: string, index): void {
    if (index === 1) {
      this.a = searchValue;
      this.box2.nativeElement.focus();
    } else if (index === 2) {
      this.b = searchValue;
      this.box3.nativeElement.focus();
    } else if (index === 3) {
      this.c = searchValue;
      this.box4.nativeElement.focus();
    } else if (index === 4) {
      this.d = searchValue;
      this.validarBoton.nativeElement.focus();
      // document.getElementById('validarBoton').focus();
    }
    this.codigoText = this.a + this.b + this.c + this.d;
    console.log('codigo= ' + this.codigoText);
  }

  async validaCodigo() {
    const result = await this.middleVerifica.validaCodigoEmail(this.id, this.codigoText);
    console.log('result= ' + result + ' - ' + this.id + ' - ' + this.codigoText);
    if (result === 200) {
    this.verificaCorreo();
    } else {
      this.error = 'El codigo es incorrecto';
    }
  }
  async verificaCorreo() {
    console.log('cr = ' + this.serviciogeneralService.getCorreo());
    const objetoDaon = await this.middleDaon.createDaonRegister(this.serviciogeneralService.getCorreo(), this.id);
    if (objetoDaon === true) {
      this.object.emailVerified = true;
      this.session.updateModel(this.object);
      await this.middleDaon.updateDaonDataUser(this.object, this.id);
      this.router.navigate([Rutas.telefono + `${this.id}`]);
    } else {
      this.router.navigate([Rutas.error]);
    }
    await this.spinner.hide();
  }
}
