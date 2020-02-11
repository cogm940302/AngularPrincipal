import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareMailService {

  public correo: string = undefined;
  constructor() { }

  setCorreo( correo: string) {
    this.correo = correo;
  }
}
