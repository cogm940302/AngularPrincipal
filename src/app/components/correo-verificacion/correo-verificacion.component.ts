import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from '../../model/RutasUtil';

@Component({
  selector: 'app-correo-verificacion',
  templateUrl: './correo-verificacion.component.html',
  styleUrls: ['./correo-verificacion.component.css']
})
export class CorreoVerificacionComponent implements OnInit {

  constructor(private router: Router) { }

  correoText = '';
  ngOnInit() {
  }

  onSearchChange(searchValue: string): void {
    this.correoText = searchValue;
  }

  validaCorreo() {
    this.router.navigate([Rutas.instrucciones]);
  }
}
