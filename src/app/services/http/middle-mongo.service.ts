import { Injectable } from '@angular/core';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { urlMiddleMongo } from '../../model/LigasUtil';

@Injectable({
  providedIn: 'root'
})
export class MiddleMongoService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  getDataUser(id: string): Observable<any> {
    console.log('El id que recibo es: ' + id);
    return this.http.get(urlMiddleMongo + `/${id}`, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
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

  updateDataUser(datos: sesionModel) {
    console.log('lo que voy actulizar es: ');
    console.log(datos);
    return this.http.put(urlMiddleMongo, datos, { headers: this.headers }).pipe(
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
