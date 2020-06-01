import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LigaUtil } from 'src/app/model/LigasUtil';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';

@Injectable({
  providedIn: 'root'
})
export class MiddleMongoService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');


  async creaTrackId(oferta: string, apiToken: string) {
    let id;
    const body = {
      merchant : apiToken,
      id : oferta
    };
    console.log(body);
    await this.http.post(LigaUtil.urlMiddleMongo(), body, { headers: this.headers })
    .toPromise().then((data) => {
      console.log(data);
      if ( data['trackId']) {
        id = data['trackId'];
      }
    }).catch((err) => {
      console.log(err);
      id = undefined;
    });
    console.log('regresare:  ' + id);
    return id;
  }
  // async getDataUser(id: string) {
  //   console.log('El id que recibo es: ' + id);
  //   let result;
  //   const servicio = this.http.get(LigaUtil.urlMiddleMongo() + `/${id}`, { headers: this.headers });
  //   await servicio.toPromise().then(data => {
  //     console.log('los datos que vienen son: ');
  //     console.log(data);
  //     if (data['estatus'] === 'nuevo' || data['estatus'] === 'en progreso') {
  //       result = data;
  //       if (data['sesion']) {
  //         result.daon = data['sesion'];
  //       } else {
  //         result.daon = {};
  //       }
  //       delete result.sesion;
  //       console.log('el final');
  //       console.log(result);
  //     } else {
  //       result._id = 'Error';
  //     }
  //   }).catch((err) => {
  //     console.log('entre al catch');
  //     return undefined;
  //   });
  //   console.log('ya voy a regresar los datos');
  //   console.log(result);
  //   return result;
  // }

  async updateTermsDataUser(datos, id: string) {
    console.log('lo que voy actulizar es: ');
    console.log(datos);
    let mongoUpdate;
    mongoUpdate = this.http.put(LigaUtil.urlMiddleMongo() + `/${id}`, datos, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
    await mongoUpdate.toPromise().then(data => {
      console.log(data);
      mongoUpdate = data;
    });
  }

  async updateDataUser(datos, id: string) {
    console.log('lo que voy actulizar es: ');
    console.log(datos);
    let mongoUpdate;
    mongoUpdate = this.http.put(LigaUtil.urlMiddleMongo() + `/${id}`, datos, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
    await mongoUpdate.toPromise().then(data => {
      console.log(data);
      mongoUpdate = data;
    });
  }
  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
