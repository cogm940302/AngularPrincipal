import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareFaceService {
  public foto: any ;
  constructor() { }

  setFoto( foto: any) {
    this.foto = foto;
    console.log('lo que guarde ');
    console.log(this.foto);
  }

  getFoto() {
    return this.foto;
  }
}
