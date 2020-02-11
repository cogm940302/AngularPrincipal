import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from '../../model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { ShareMailService } from '../../services/share/share-mail.service';

@Component({
  selector: 'app-correo-verificacion',
  templateUrl: './correo-verificacion.component.html',
  styleUrls: ['./correo-verificacion.component.css']
})
export class CorreoVerificacionComponent implements OnInit {

  constructor(private router: Router, private sesion: SessionService, private sharedata: ShareMailService) { }

  correoText = '';
  ngOnInit() {
    let valorDelObjeto = this.sesion.getObjectSession();
    if (valorDelObjeto === null || valorDelObjeto === undefined) {
      this.router.navigate([Rutas.terminos]);
    }
  }

  onSearchChange(searchValue: string): void {
    this.correoText = searchValue;
  }

  validaCorreo() {
    this.sharedata.setCorreo(this.correoText);
    this.router.navigate([Rutas.sesionIniciada]);
  }
}
