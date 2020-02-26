import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ShareMailService } from '../../services/share/share-mail.service';
import { sesionModel } from '../../model/sesion/terminos';

@Component({
  selector: 'app-sesion-iniciada',
  templateUrl: './sesion-iniciada.component.html',
  styleUrls: ['./sesion-iniciada.component.css']
})
export class SesionIniciadaComponent implements OnInit {

  private modelo: sesionModel;
  filtersLoaded: Promise<boolean>;
  hrefUser;
  constructor(private router: Router, private sesion: SessionService, private http: HttpClient, private share: ShareMailService) { }

  async ngOnInit() {
    let valorDelObjeto = this.sesion.getObjectSession();
    console.log('valorDelObjeto');
    console.log(valorDelObjeto);
    /*Validamos que venga del check de terminos */
    if (valorDelObjeto === null || valorDelObjeto === undefined) {
      this.router.navigate([Rutas.terminos]);
    } else {
      await this.createDaonRegister();
      // const value = await this.teniaSesionIniciada();
      // console.log('tenia : ' + value);
      // if (!value) {
      //   console.log('5 entre aqui');
      // await this.nuevoRegistro();
      await this.updateValues();
      // } else {
      //   this.filtersLoaded = Promise.resolve(true);
      //   console.log('6 es un viejo registro');
      // }
    }
  }
  urlMidd = 'https://5ghhi5ko87.execute-api.us-east-2.amazonaws.com/test/middservdaon';

  async createDaonVinculation() {
    const urlDaon = 'https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/IdentityXServices/rest/v1/registrations';

  }

  async createDaonRegister() {
    console.log('servicio para crear registro en DAON');
    const urlDaon = 'https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/IdentityXServices/rest/v1/users';
    const jsonToSend = { "userId": `${this.share.correo}`, "url": `${urlDaon}` };
    console.log(jsonToSend);
    console.log(JSON.stringify(jsonToSend));
    try {
      return this.http.post(this.urlMidd, jsonToSend).toPromise().then(data => {
        console.log(data);
        if (data['statusCode'] !== 200) {
          console.log('no lo pude guardad');
          // TODO tengo que ir a mongo a recuperar el valor de href para ligarlo a la empresa,
          // pero si ya esta ligado a la empresa no debo volverlo a ligar
        } else {
          // TODO guardar en mongo los datos
          console.log('si lo guarde papa');
          this.hrefUser = data['body']['href'];
        }
      });
    } catch (e) {
      this.modelo = null;
      console.error('Error guardar en daon');
      console.error(e);
    }
  }

  async serviceCorreo() {
    console.log('2 entre al servicio de correos ');
    try {
      const url = 'https://5ghhi5ko87.execute-api.us-east-2.amazonaws.com/test/usuarios/correo/' + this.share.correo;
      return this.http.get(url).toPromise().then(data => {
        if (data != null) {
          this.modelo = new sesionModel();
          this.modelo.terminos = true;
          this.modelo.correo = data['correo'];
        }
        console.log('3 esta es la data que traje ');
        console.log(data);
      });
    } catch (e) {
      this.modelo = null;
      console.error('Error al traer el registro mediante el correo');
      console.error(e);
    }
  }

  guardaCorreo() {
    this.sesion.setMail(this.share.correo);
    const url = 'https://5ghhi5ko87.execute-api.us-east-2.amazonaws.com/test/usuarios';
    console.log('this.modelo');
    this.modelo = new sesionModel();
    this.modelo.correo = this.share.correo;
    console.log(this.modelo);
    console.log(JSON.stringify(this.modelo));
    return this.http.post(url, this.modelo).toPromise().then(response => {
      console.log(JSON.stringify(response));
      if (response != null) {
        this.sesion.setId(response['id']);
      }
    }).catch((error: any) => {
      console.log('Hubo un error');
      console.log(error);
    }
    );
  }

  async teniaSesionIniciada() {
    console.log('1 voy por los valores ya obtenidos ');
    await this.serviceCorreo();
    console.log(' 4 no se si lo espere');
    console.log(this.modelo);
    if (this.modelo !== undefined && this.modelo !== null && this.modelo.correo !== undefined && this.modelo.score === null) {
      console.log('tenia sesion iniciada y no terminada');
      return true;
    } else {
      console.log('no tenia nada');
      return false;
    }
  }

  async updateValues() {
    this.modelo = this.sesion.getObjectSession();
    this.modelo.correo = this.share.correo;
    this.sesion.updateModel(this.modelo);
    this.router.navigate([Rutas.instrucciones]);
  }

  async nuevoRegistro() {
    await this.guardaCorreo();
    this.router.navigate([Rutas.instrucciones]);
  }

  continuarRegistro() {
    this.sesion.updateModel(this.modelo);
    this.router.navigate([Rutas.instrucciones]);
  }
}
