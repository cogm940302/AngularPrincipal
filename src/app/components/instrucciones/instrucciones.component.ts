import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {

  constructor(private router: Router, private sesion: SessionService) { }

  ngOnInit() {
    let valorDelObjeto = this.sesion.getObjectSession();
    if (valorDelObjeto === null || valorDelObjeto === undefined) {
      this.router.navigate([Rutas.terminos]);
    }
  }

}
