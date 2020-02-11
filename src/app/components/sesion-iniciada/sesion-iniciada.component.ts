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
  constructor(private router: Router, private sesion: SessionService, private http: HttpClient, private share: ShareMailService) { }

  async ngOnInit() {
    let valorDelObjeto = this.sesion.getObjectSession();
    if (valorDelObjeto === null || valorDelObjeto === undefined) {
      this.router.navigate([Rutas.terminos]);
    }
    const value = await this.teniaSesionIniciada();
    if (!value) {
      console.log('5 entre aqui');
      this.nuevoRegistro();
    }
    console.log('me la salte');
  }
  async serviceCorreo() {
    console.log('2 entre al servicio de correos ');
    try {
      const url = 'https://5ghhi5ko87.execute-api.us-east-2.amazonaws.com/test/usuarios/correo/';
      return this.http.get(url + this.share.correo).toPromise().then(data => {
        this.modelo = new sesionModel();
        this.modelo.aceptar = true;
        this.modelo.correo = data['correo'];
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

  nuevoRegistro() {
    this.guardaCorreo();
    this.router.navigate([Rutas.instrucciones]);
  }

  continuarRegistro() {
    this.sesion.updateModel(this.modelo);
    this.router.navigate([Rutas.instrucciones]);
  }
}
