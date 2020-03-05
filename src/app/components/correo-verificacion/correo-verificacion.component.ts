import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from '../../model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { ShareMailService } from '../../services/share/share-mail.service';
import { MiddleDaonService } from 'src/app/services/http/middle-daon.service';
import { sesionModel } from '../../model/sesion/SessionPojo';
import { MiddleMongoService } from '../../services/http/middle-mongo.service';

@Component({
  selector: 'app-correo-verificacion',
  templateUrl: './correo-verificacion.component.html',
  styleUrls: ['./correo-verificacion.component.css']
})
export class CorreoVerificacionComponent implements OnInit {

  constructor(private router: Router, private session: SessionService, private sharedata: ShareMailService,
    private actRoute: ActivatedRoute, private middleDaon: MiddleDaonService,
    private middleMongo: MiddleMongoService) { }

  filtersLoaded: Promise<boolean>;
  correoText = '';
  id: any;
  object: sesionModel;

  async ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    // if (!await this.alredySessionExist()) { return; }
    this.filtersLoaded = Promise.resolve(true);
  }

  async alredySessionExist() {
    this.object = this.session.getObjectSession();
    console.log(this.object);
    if (this.object === null || this.object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      console.log(this.id);
      console.log(this.object._id);
      if (this.object._id !== this.id) {
        console.log(this.id);
        this.router.navigate([Rutas.error]);
        return false;
      } else if (this.object.correo !== null && this.object.correo !== undefined && this.object.correo !== ''
        && this.object.daon.daonHref !== null && this.object.daon.daonHref !== undefined && this.object.daon.daonHref !== '') {
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
    // const objetoDaon = await this.middleDaon.createDaonRegister(this.correoText);
    // console.log('pase del servicio');
    // console.log(objetoDaon);
    // this.object.correo = this.correoText;
    // if (objetoDaon['statusCode'] === 200) {
    //   this.object.daon.daonHref = objetoDaon['body']['href'];
    // } else {
    //   // si ya existe voy a buscarlo en la bd de mongo
    //   await this.middleMongo.getDataHrefUser(this.correoText).toPromise().then(data => {
    //     console.log(data);
    //     this.object.daon.daonHref = data['body']['daon']['daonHref'];
    //   });
    // }
    // console.log(this.object.daon.daonHref);
    // if (!this.object.daon.daonHref) {
    //   this.router.navigate([Rutas.error]);
    //   return;
    // }
    // // ligarlo al cliente actual
    // const resultDaon = await this.middleDaon.relationClientUser(this.object.daon.daonHref, this.object.daon.daonHref);
    // console.log('resultDaon');
    // console.log(resultDaon);
    // if (resultDaon['statusCode'] === 200) {
    //   this.object.daon.daonHref = resultDaon['body']['href'];
    // } else if (resultDaon['body']['message'].contains('already exists')) {
    //   console.log('ya existe el usuario');
    // } else {
    //   this.router.navigate([Rutas.error]);
    //   return;
    // }
    // this.session.updateModel(this.object);
    // this.object.correo = this.correoText;
    // let mongoUpdate;
    // await this.middleMongo.updateDataUser(this.object).toPromise().then(data => {
    //   console.log(data);
    //   mongoUpdate = data;
    // });
    // this.sharedata.setCorreo(this.correoText);
    // this.router.navigate([Rutas.instrucciones + `${this.id}`]);
    this.router.navigate([Rutas.fin]);
  }
}
