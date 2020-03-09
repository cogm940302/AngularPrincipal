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

  async updateModel(sessionObject: sesionModel) {
    this.sesionObject = sessionObject;
    console.log(JSON.stringify(this.sesionObject));
    sessionStorage.clear();
    sessionStorage.setItem('currentSessionDaon', JSON.stringify(this.sesionObject));
  }

  getObjectSession() {
    return JSON.parse(sessionStorage.getItem('currentSessionDaon'));
  }
}
