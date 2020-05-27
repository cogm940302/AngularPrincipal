import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorSelfieService } from 'src/app/services/errores/error-selfie.service';
import { SessionService } from 'src/app/services/session/session.service';
import { environment } from '../../../../../environments/environment';
import { FP } from '@fp-pro/client';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.component.html',
  styleUrls: ['./instrucciones.component.css']
})
export class InstruccionesComponent implements OnInit {

  constructor(private router: Router, private session: SessionService, private actRoute: ActivatedRoute,
              private spinner: NgxSpinnerService, private errorSelfieService: ErrorSelfieService) { }

  filtersLoaded: Promise<boolean>;
  id: string;
  errorMensaje: string;

  async ngOnInit() {
    this.errorMensaje = this.errorSelfieService.returnMensaje();
    await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({tag: {tag:this.id}});
    if (!(await this.alredySessionExist())) { return; }
    this.filtersLoaded = Promise.resolve(true);
    await this.spinner.hide();
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    const objectSecureToken = this.session.getSecureTouchToken();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.daon && object.daon.selfie) {
        this.router.navigate([Rutas.chooseIdentity + `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }
  continuar() {
    this.errorSelfieService.mensaje = '';
    this.router.navigate([Rutas.selfie + `${this.id}`]);
  }
}
