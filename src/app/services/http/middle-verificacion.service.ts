import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LigaUtil } from 'src/app/model/LigasUtil';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class MiddleVerificacionService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  async generaCodigoEmail(id: string, correo: string) {
    let result = 200;
    await this.http.post(LigaUtil.urlMiddleRoot(id) + `email`, { userId : correo}, { headers: this.headers, })
    .toPromise().then(datos => {
      console.log(datos);
      if (datos['errorType']) {
        result = 404;
      }
    }).catch((err) => {
      console.log('error');
      console.log(err);
      result = 404;
    });
    return result;
  }

  async validaCodigoEmail(id: string, codigo: string) {
    let result = 200;
    await this.http.post(LigaUtil.urlMiddleRoot(id) + `email/verify`, {code: codigo}, { headers: this.headers, })
    .toPromise().then(datos => {
      console.log(datos);
      if (datos['errorType']) {
        result = 404;
      }
    }).catch((err) => {
      console.log('error');
      console.log(err);
      result = 404;
    });
    return result;
  }
}
