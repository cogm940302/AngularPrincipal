import { Injectable } from '@angular/core';
import { sesionModel } from '../../model/sesion/SessionPojo';

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

  setId(id: string) {
    this.sesionObject = JSON.parse(sessionStorage.getItem('currentSessionDaon'));
    this.sesionObject._id = id;
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

  getObjectSession() {
    return JSON.parse(sessionStorage.getItem('currentSessionDaon'));
  }
}
