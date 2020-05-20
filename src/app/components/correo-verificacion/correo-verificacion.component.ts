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

@Component({
  selector: 'app-correo-verificacion',
  templateUrl: './correo-verificacion.component.html',
  styleUrls: ['./correo-verificacion.component.css']
})
export class CorreoVerificacionComponent implements OnInit {

  constructor(private router: Router, private session: SessionService,
              private actRoute: ActivatedRoute, private middleDaon: MiddleDaonService,
              private middleMongo: MiddleMongoService, private spinner: NgxSpinnerService) { }

  filtersLoaded: Promise<boolean>;
  correoText = '';
  id: any;
  object: sesionModel;

  async ngOnInit() {
    await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({linkedId: this.id});
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

  async validaCorreo() {
    await this.spinner.show();
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
