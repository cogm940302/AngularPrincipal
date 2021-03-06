import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';

@Component({
  selector: 'app-verify-identity',
  templateUrl: './verify-identity.component.html',
})
export class VerifyIdentityComponent implements OnInit {

  constructor(public router: Router, private session: SessionService, public servicesGeneralService: ServicesGeneralService,
              private actRoute: ActivatedRoute) { }

  filtersLoaded: Promise<boolean>;
  typeIdentity: string;
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
      } else if (object.identity !== null && object.identity !== undefined && object.identity !== '') {
        this.router.navigate([Rutas.livenessInstruction + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  agregarOferta(ti) {
    this.typeIdentity = ti;
    console.log('ti= ' + this.typeIdentity );
    this.servicesGeneralService.settI(this.typeIdentity);
    this.servicesGeneralService.setFrontAndBack('front');
    this.router.navigate([Rutas.documentInstruction + `${this.id}`]);
  }

}
