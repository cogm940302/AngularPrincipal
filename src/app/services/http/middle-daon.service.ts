import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { urlMiddleMongo } from 'src/app/model/LigasUtil';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiddleDaonService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  async consumLalo() {
    let mongoUpdate;
    mongoUpdate = this.http.get('https://j0d8m0b5xe.execute-api.us-east-1.amazonaws.com/test' + `/prueba`, { headers: this.headers }).pipe(
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

  async updateDaonDataUser(datos: sesionModel, id: string) {
    console.log('lo que voy actulizar es: ');
    console.log(datos.daon);
    let mongoUpdate;
    mongoUpdate = this.http.put(urlMiddleMongo + `/${id}`, datos.daon, { headers: this.headers }).pipe(
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

  async createDaonRegister(correo: string, id: string) {
    console.log('servicio para crear registro en DAON');
    let result;
    const jsonToSend = { userId: `${correo}`, trackId: `${id}` };
    console.log(jsonToSend);
    // console.log(JSON.stringify(jsonToSend));
    try {
      await this.http.post(urlMiddleMongo, jsonToSend).toPromise().then(data => {
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
