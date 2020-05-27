import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LigaUtil } from 'src/app/model/LigasUtil';


@Injectable({
  providedIn: 'root'
})
export class MiddleDaonService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'q=0.8;application/json;q=0.9' });

  async updateDataUser(datos: sesionModel, id: string) {
    console.log('lo que voy actulizar es: ');
    console.log(datos);
    let mongoUpdate;
    mongoUpdate = this.http.put(LigaUtil.urlMiddleMongo() + `/${id}`, datos, { headers: this.headers });
    await mongoUpdate.toPromise().then(data => {
      console.log(data);
      mongoUpdate = data;
    });
  }
  async updateDaonDataUser(datos: sesionModel, id: string) {
    console.log('lo que voy actulizar es: ');
    console.log(datos.daon);
    let mongoUpdate;
    mongoUpdate = this.http.put(LigaUtil.urlMiddleMongo() + `/${id}`, datos.daon, { headers: this.headers });
    await mongoUpdate.toPromise().then(data => {
      console.log(data);
      mongoUpdate = data;
    });
  }

  async sendInfoDaon(data, id: string, metodo: string) {
    let statusCode = 0;
    const result = this.http.post(LigaUtil.urlMiddleDaon(id) + `/${metodo}`, JSON.stringify(data), { headers: this.headers, });
    await result.toPromise().then(datos => {
      statusCode = 200;
      console.log(datos);
      console.log(JSON.stringify(datos));
      console.log(datos['processingStatus']);
      if (datos['processingStatus'] === 'FAILED') {
        statusCode = 400;
      }
    }).catch(err => {
      console.log(err);
      statusCode = 400;
    });
    return statusCode;
  }

  async getResults(id: string) {
    let statusCode = 0;
    const result = this.http.post(LigaUtil.urlMiddleDaon(id) + `/evaluation`, {}, { headers: this.headers, });
    await result.toPromise().then(datos => {
      console.log('resultados');
      console.log(datos);
      if (datos['errorType'] || datos['errorMessage']) {
        statusCode = 400;
      } else {
        statusCode = 200;
      }
    }).catch(err => {
      console.log(err);
      statusCode = 400;
    });
    return statusCode;
  }


  async createDaonRegister(correo: string, id: string) {
    console.log('servicio para crear registro en DAON');
    let result;
    const jsonToSend = { userId: `${correo}`, trackId: `${id}` };
    console.log(jsonToSend);
    // console.log(JSON.stringify(jsonToSend));
    try {
      await this.http.post(LigaUtil.urlMiddleMongo(), jsonToSend).toPromise().then(data => {
        console.log(data);
        result = data;
      });
    } catch (e) {
      console.error('Error guardar en daon');
      console.error(e);
    }
    if (result.statusCode) {
      return true;
    } else {
      return false;
    }
  }


  async getDataOCR(id: string) {
    let dataOCR = {};
    await this.http.get(LigaUtil.urlMiddleDaon(id) + `/ocrCheck`, { headers: this.headers, })
      .toPromise().then(datos => {
        console.log('resultados');
        console.log(JSON.stringify(datos));
        if (datos['errorType']) {
          dataOCR = { error: datos['errorType'] };
        } else if (datos['errorMessage']) {
          dataOCR = { error: datos['errorMessage'] };
        } else {
          dataOCR = datos;
        }
      }).catch(err => {
        console.log(err);
        dataOCR = { error: err };
      });
    return dataOCR;
  }
}
