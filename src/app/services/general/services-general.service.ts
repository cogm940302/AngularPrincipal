import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicesGeneralService {

  img64:String;
  tI:string;
  frontAndBack:string;
  isUpload:boolean;
  resultLiveness:string;
  mensajeLiveness:string;
  
  constructor(private http: HttpClient) { }

  setIsUpload(b){
    this.isUpload=b;
  }

  getIsUpload(){
    return this.isUpload;
  }
  setResultLiveness(result){
    this.resultLiveness=result;
  }

  getResultLiveness() {
    return this.resultLiveness;
  }

  setMensaje(mensaje) {
    this.mensajeLiveness = mensaje;
  }

  getMensajeLiveness() {
    return this.mensajeLiveness;
  }

  settI(ti) {
    this.tI = ti;
  }

  gettI(): string{
    return this.tI;
  }

  setImg64(img) {
    this.img64 = img;
  }

  getImg64(): string {
    return this.img64;
  }

  setFrontAndBack(fb) {
    this.frontAndBack = fb;
  }

  getFrontAndBack() {
    return this.frontAndBack;
  }

  headers = new HttpHeaders().set('Content-Type', 'application/json',).set('Accept','application/json');


  sendImgDaon(data): Observable<any> {
    const url = `api/mitsoluciones3/IdentityXServices/rest/v1/users/QTAznsU-sPmUj0XyvprQAjjE4Q/face/samples`;

    return this.http.post(url, data, { headers: this.headers,  }).pipe(
      catchError(this.errorMgmt)
    );
  }

  sendDocDaon(data): Observable<any> {
    const url = `https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/DigitalOnBoardingServices/rest/v1/users/QTAzJc8L4vVRCaztQuscK0B7uQ/idchecks/Yf7ALTADELDB_q13FHKHfw/documents`;

    return this.http.post(url, data, { headers: this.headers,  }).pipe(
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
    console.log("errrrrrrrrrrrr= " + errorMessage);
    return throwError(errorMessage);
  }
}

export function isMobile(userAgent) {
  return !!userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
}
