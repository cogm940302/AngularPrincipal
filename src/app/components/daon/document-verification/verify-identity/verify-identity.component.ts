import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { environment } from '../../../../../environments/environment';
import { FP } from '@fp-pro/client';

@Component({
  selector: 'app-verify-identity',
  templateUrl: './verify-identity.component.html',
  styleUrls: ['./verify-identity.component.css']
})
export class VerifyIdentityComponent implements OnInit {

  constructor(public router: Router, private session: SessionService, public servicesGeneralService: ServicesGeneralService,
              private actRoute: ActivatedRoute) { }

  filtersLoaded: Promise<boolean>;
  typeIdentity: string;
  error: string;
  id: string;

  async ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({tag: {tag: this.id}});
    if (!(await this.alredySessionExist())) { return; }
    this.error = sessionStorage.getItem('errorDocument');
    this.filtersLoaded = Promise.resolve(true);

    //$('#INEOption').click();

    $( "#INEOption" ).trigger( "click" );

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
      } else if (object.daon.identity) {
        this.router.navigate([Rutas.livenessInstruction + `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }
    ti="";
    sentTi(ti_){
      $('#INEOption').attr('style','box-shadow: 0 0 0 0.2rem rgba(108,117,125,.5)');
      this.ti=ti_;
      console.log(this.ti);
    }
    sendDoc() {
    if(this.ti!==""){
      this.typeIdentity = this.ti;
      console.log('ti= ' + this.typeIdentity );
      this.servicesGeneralService.settI(this.typeIdentity);
      this.servicesGeneralService.setFrontAndBack('front');
      sessionStorage.removeItem('errorDocument');
      this.router.navigate([Rutas.documentInstruction + `${this.id}`]);
    }else{this.error='Seleccione un tipo de documento'}

  }

}
