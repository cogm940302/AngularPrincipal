import { Component, OnInit } from '@angular/core';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-liveness-instruction',
  templateUrl: './liveness-instruction.component.html',

})
export class LivenessInstructionComponent implements OnInit {

  constructor(public router: Router, private session: SessionService, private actRoute: ActivatedRoute) { }
  id: string;

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!this.alredySessionExist()) { return; }
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.daon.pruebaVida) {
        this.router.navigate([Rutas.fin]);
        return false;
      } else {
        return true;
      }
    }
  }

  enter() {
    this.router.navigate([Rutas.livenessCapture + `${this.id}`]);
  }

}
