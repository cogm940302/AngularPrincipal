import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorSelfieService {

  constructor() { }

  mensaje: string;

  returnMensaje() {
    return this.mensaje;
  }
}
