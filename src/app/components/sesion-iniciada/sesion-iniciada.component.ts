import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ShareMailService } from '../../services/share/share-mail.service';
import { sesionModel } from '../../model/sesion/SessionPojo';

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
      await this.updateValues();
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
          // pero si ya esta ligado a la empresa no debo volverlo a ligar o lo ligamos pero si ocurre error pues pensar que ya esta
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

  async updateValues() {
    this.modelo = this.sesion.getObjectSession();
    this.modelo.correo = this.share.correo;
    this.sesion.updateModel(this.modelo);
    this.router.navigate([Rutas.instrucciones]);
  }
}
