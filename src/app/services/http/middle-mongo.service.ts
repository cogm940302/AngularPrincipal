import { Injectable } from '@angular/core';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { urlMiddleMongo } from '../../model/LigasUtil';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class MiddleMongoService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  async getDataUser(id: string) {
    console.log('El id que recibo es: ' + id);
    let result;
    const servicio = this.http.get(urlMiddleMongo + `/${id}`, { headers: this.headers }).pipe(map((res: Response) => {
      return res || {};
    }),
      catchError(this.errorMgmt)
    );
    await servicio.toPromise().then(data => {
      console.log('los datos que vienen son: ');
      console.log(data);
      if (data['estatus'] === 'nuevo' || data['estatus'] === 'en progreso') {
        result = data;
        if (data['sesion']) {
          result.daon = data['sesion']['daon'];
        } else {
          result.daon = {};
        }
      } else {
        result._id = 'Error';
      }
    });
    // if (result !== undefined && result._id) {
    //   exist = true;
    // }
    console.log('ya voy a regresar los datos');
    console.log(result);
    return result;
  }

  async updateTermsDataUser(datos, id: string) {
    console.log('lo que voy actulizar es: ');
    console.log(datos);
    let mongoUpdate;
    mongoUpdate = this.http.put(urlMiddleMongo + `/${id}`, datos, { headers: this.headers }).pipe(
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

  getDataHrefUser(correo: string) {
    console.log(urlMiddleMongo + `/correo/${correo}`);
    return this.http.get(urlMiddleMongo + `/correo/${correo}`, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
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
