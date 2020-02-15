import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareFaceService {
  public foto: string = undefined;
  constructor() { }

  setFoto( foto: string) {
    this.foto = foto;
  }
}
