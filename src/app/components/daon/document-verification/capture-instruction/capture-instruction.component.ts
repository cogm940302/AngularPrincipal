import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';

@Component({
  selector: 'app-capture-instruction',
  templateUrl: './capture-instruction.component.html',
})
export class CaptureInstructionComponent implements OnInit {

  constructor(public router: Router, public serviciogeneralService: ServicesGeneralService, private actRoute: ActivatedRoute,
              private session: SessionService) {

    if (serviciogeneralService.gettI() !== undefined && serviciogeneralService.getFrontAndBack() !== undefined) {
      sessionStorage.setItem('ti', serviciogeneralService.gettI());
      sessionStorage.setItem('fb', serviciogeneralService.getFrontAndBack());
      this.titulo = serviciogeneralService.gettI() + ' 1photo page ' + serviciogeneralService.getFrontAndBack();
    } else if (sessionStorage.getItem('ti') === undefined || sessionStorage.getItem('fb') === undefined) {
      this.router.navigate(['']);
    } else {
      this.titulo = sessionStorage.getItem('ti') + ' 2photo page ' + sessionStorage.getItem('fb');
    }
  }

  titulo: string;
  id: string;

  ngOnInit() {
    console.log('titulo= ' + this.titulo);
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    // if (!this.alredySessionExist()) { return; }
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
      } else if (object.identity !== null && object.identity !== undefined && object.identity !== '') {
        this.router.navigate([Rutas.livenessInstruction + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  back() {
    this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
  }

  captueWCamera() {
    this.router.navigate([Rutas.documentCapture + `${this.id}`]);
  }

}
