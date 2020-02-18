import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PruebaService {

  foto: any = undefined;
  constructor() { }

  setFoto(url: any) {
    this.foto = url;
  }
}
