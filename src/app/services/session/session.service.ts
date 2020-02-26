import { Injectable } from '@angular/core';
import { sesionModel } from '../../model/sesion/terminos';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private hasAcceptedTermsAndConditions: boolean;
  public sesionObject: sesionModel;

  constructor() {
    this.sesionObject = new sesionModel();
    this.sesionObject.terminos = false;
  }

  cleanValues() {
    sessionStorage.clear();
  }
  updateModel(sessionObject: sesionModel) {
    this.sesionObject = sessionObject;
    console.log(JSON.stringify(this.sesionObject));
    sessionStorage.clear();
    sessionStorage.setItem('currentSessionDaon', JSON.stringify(this.sesionObject));
  }

  setTermsAndConditionsTrue(id) {
    this.sesionObject.terminos = true;
    this.sesionObject.id = id;
    console.log('voy a guardar: ');
    console.log(JSON.stringify(this.sesionObject));
    sessionStorage.setItem('currentSessionDaon', JSON.stringify(this.sesionObject));
  }

  setId(id: string) {
    this.sesionObject = JSON.parse(sessionStorage.getItem('currentSessionDaon'));
    this.sesionObject.id = id;
    sessionStorage.clear();
    console.log(JSON.stringify(this.sesionObject));
    sessionStorage.setItem('currentSessionDaon', JSON.stringify(this.sesionObject));
  }
  setMail(correo: string) {
    this.sesionObject = JSON.parse(sessionStorage.getItem('currentSessionDaon'));
    this.sesionObject.correo = correo;
    console.log(JSON.stringify(this.sesionObject));
    sessionStorage.setItem('currentSessionDaon', JSON.stringify(this.sesionObject));
  }

  isTermsAndConditionsTrue() {
    this.sesionObject = JSON.parse(sessionStorage.getItem('currentSessionDaon'));
    console.log(this.sesionObject);
    if (this.sesionObject === null) {
      this.sesionObject = new sesionModel();
      return false;
    }
    console.log('voy a regresar: ' + this.sesionObject.terminos);
    return this.sesionObject.terminos;
  }

  getObjectSession() {
    return JSON.parse(sessionStorage.getItem('currentSessionDaon'));
  }
}
