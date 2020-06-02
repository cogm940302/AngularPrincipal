import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from '../../model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { MiddleDaonService } from 'src/app/services/http/middle-daon.service';
import { sesionModel } from '../../model/sesion/SessionPojo';
import { MiddleMongoService } from '../../services/http/middle-mongo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { FP } from '@fp-pro/client';
import { MiddleVerificacionService } from '../../services/http/middle-verificacion.service';
import { ServicesGeneralService } from '../../services/general/services-general.service';

@Component({
  selector: 'app-correo-verificacion',
  templateUrl: './correo-verificacion.component.html',
  styleUrls: ['./correo-verificacion.component.css']
})
export class CorreoVerificacionComponent implements OnInit {

  constructor(public serviciogeneralService: ServicesGeneralService, private router: Router, private session: SessionService,
              private actRoute: ActivatedRoute, private middleDaon: MiddleDaonService,
              private middleMongo: MiddleMongoService, private spinner: NgxSpinnerService,
              private middleVerifica: MiddleVerificacionService) { }

  filtersLoaded: Promise<boolean>;
  object: sesionModel;
  correoText = '';
  error = '';
  id: any;

  async ngOnInit() {
    await this.spinner.show();
    document.getElementById("errorMessageCorreo").style.display = "none";
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({tag: this.id});
    if (!(await this.alredySessionExist())) { return; }
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

  onSearchChange(searchValue: string): void {
    this.correoText = searchValue;
  }

  async aceptar() {
    await this.spinner.show();
    this.correoText=this.correoText.toLowerCase();
    console.log("correo= " + this.correoText);
    if (this.correoText.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')){
      document.getElementById("errorMessageCorreo").style.display = "none";
      await this.middleVerifica.generaCodigoEmail(this.id, this.correoText);
      this.serviciogeneralService.setCorreo(this.correoText);
      this.router.navigate([Rutas.correoCode + `${this.id}`]);
      await this.spinner.hide();
      return true;
    }else {
      document.getElementById("errorMessageCorreo").style.display = "block";
      await this.spinner.hide();
        return false;
    }


  }
}
