import { Injectable } from '@angular/core';
import { sesionModel } from '../../model/sesion/SessionPojo';
import { environment } from '../../../environments/environment';


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

  async updateModel(sessionObject: sesionModel) {
    this.sesionObject = sessionObject;
    console.log(JSON.stringify(this.sesionObject));
    sessionStorage.clear();
    sessionStorage.setItem('currentSessionDaon', JSON.stringify(this.sesionObject));
    sessionStorage.setItem('environment', environment.secureTouchToken);
  }

  getObjectSession() {
    return JSON.parse(sessionStorage.getItem('currentSessionDaon'));
  }

  getSecureTouchToken(){
    return sessionStorage.getItem('environment');
  }
}
