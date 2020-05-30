import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css']
})
export class FinalComponent implements OnInit {

  title = '¡Listo!';
  imgUrl = '../../../../../assets/img/final/22.Final.png';
  instruction = '¡Gracias por verificar tu identidad!';
  btnText = 'Finalizar';

  constructor(private router: Router, private sesion: SessionService, private session: SessionService) { }

  object: sesionModel;
  routeToReturn: string;

  ngOnInit() {
    this.getDataToRedirect();
    const redirectTo = this.routeToReturn;
    $('#finalizarBtn').click(function () {
      console.log('click on btn finalizar');
      window.location.href = redirectTo;
    });
  }

  getDataToRedirect() {
    this.object = this.session.getObjectSession();
    if (this.object !== undefined && this.object !== null && this.object.callback) {
      this.routeToReturn = this.object.callback;
      sessionStorage.clear();
    }
  }
}
