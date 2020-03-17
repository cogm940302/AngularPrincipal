import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorVidaService {

  constructor() { }
  public mensaje: string;

  returnMensaje() {
    return this.mensaje;
  }
}
