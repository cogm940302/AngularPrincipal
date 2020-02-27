import { Injectable } from '@angular/core';
import { sesionModel } from 'src/app/model/sesion/terminos';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MiddleMongoService {

  constructor(private http: HttpClient) { }

  urlMiddle = 'https://5ghhi5ko87.execute-api.us-east-2.amazonaws.com/test/usuarios';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  getDataUser(id: string): Observable<any> {
    console.log('El id que recibo es: ' + id);
    return this.http.get(this.urlMiddle + `/${id}`, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );

    // TODO Consumir servicio que te traera la informacion del id
    // return '{ "_id":"1234567890", "score" : null }';
  }

  updateDataUser(datos: sesionModel) {
    // TODO servicios para actualizar datos
    return '{ "_id":"1234567890", "score" : null, terminos : true }';
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
