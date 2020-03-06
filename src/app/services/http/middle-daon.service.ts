import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlDaonCreaUser, urlMiddDaon, urlDaonRelationUserClient, urlDaonMain } from 'src/app/model/LigasUtil';

@Injectable({
  providedIn: 'root'
})
export class MiddleDaonService {

  constructor(private http: HttpClient) { }

  async createDaonRegister(correo: string) {
    console.log('servicio para crear registro en DAON');
    let result;
    const jsonToSend = { "userId": `${correo}`, "url": `${urlDaonCreaUser}`, "metodo": "POST" };
    console.log(jsonToSend);
    console.log(JSON.stringify(jsonToSend));
    try {
      await this.http.post(urlMiddDaon, jsonToSend).toPromise().then(data => {
        console.log(data);
        result = data;
      });
    } catch (e) {
      console.error('Error guardar en daon');
      console.error(e);
    }
    return result;
  }

}
