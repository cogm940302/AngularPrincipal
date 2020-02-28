import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../services/session/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {

  constructor(private router: Router, private session: SessionService, private actRoute: ActivatedRoute) { }

  filtersLoaded: Promise<boolean>;
  id: string;

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!this.alredySessionExist()) { return; }
    this.filtersLoaded = Promise.resolve(true);
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.selfie !== null && object.selfie !== undefined && object.selfie !== '') {
        this.router.navigate([Rutas.fin]);
        return false;
      } else {
        return true;
      }
    }
  }
  continuar() {
    this.router.navigate([Rutas.fin]);
  }
}
