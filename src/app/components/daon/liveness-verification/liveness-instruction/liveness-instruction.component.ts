import { Component, OnInit } from '@angular/core';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { ErrorVidaService } from 'src/app/services/errores/error-vida.service';
import { environment } from '../../../../../environments/environment';
import { FP } from '@fp-pro/client';

@Component({
  selector: 'app-liveness-instruction',
  templateUrl: './liveness-instruction.component.html',

})
export class LivenessInstructionComponent implements OnInit {

  title = "Prueba de vida";      
  imgUrl="../../../../../assets/img/Daon/19.Prueba_de_vida.png";
  instruction="A continuación se te tomará un video.";
  stepOne="Aségurate de estar en un área bien iluminada."; 
  stepTwo="Sigue las instrucciones de la pantalla.";  
  btnTitle = "Iniciar grabación";

  constructor(public router: Router, private session: SessionService, private actRoute: ActivatedRoute,
              private errorVidaService: ErrorVidaService) { }

  filtersLoaded: Promise<boolean>;
  errorMensaje: string;
  id: string;

  async ngOnInit() {
    console.log('mensaje: ' + this.errorVidaService.mensaje);
    console.log('mensaje: ' + this.errorVidaService.returnMensaje());
    this.errorMensaje = this.errorVidaService.returnMensaje();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    const fp = await FP.load({client: environment.fingerJsToken, region: 'us'});
    fp.send({tag: {tag:this.id}});
    if (!(await this.alredySessionExist())) { return; }
    this.filtersLoaded = Promise.resolve(true);
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
        this.router.navigate([Rutas.cuentaClabe]);
        return false;
      } else {
        return true;
      }
    }
  }

  enter() {
    this.errorVidaService.mensaje = 'No se ha podido validar tu video, intenta otra vez';
    this.router.navigate([Rutas.livenessCapture + `${this.id}`]);
  }

}
