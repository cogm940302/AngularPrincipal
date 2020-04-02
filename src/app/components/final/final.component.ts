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

  constructor(private router: Router, private sesion: SessionService, private session: SessionService) { }

  object: sesionModel;
  routeToReturn: string;

  ngOnInit() {
    this.getDataToRedirect();
  }

  getDataToRedirect() {
    this.object = this.session.getObjectSession();
    if ( this.object !== undefined && this.object !== null && this.object.callback) {
      const returnUrl = this.object.callback;
      sessionStorage.clear();
      setTimeout( () => {
        window.location.href = returnUrl;
      }, 5000 );
    }
  }
}
