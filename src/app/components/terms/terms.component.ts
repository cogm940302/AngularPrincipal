import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { politicaDePrivacidad, terminosDeUso } from '../../model/documentos/aceptacion';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MiddleMongoService } from '../../services/http/middle-mongo.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  state = {
    checked: false,
    isAccepted: 'unset',
    termsOfUse: false,
    privacyPolicy: false
  };

  textoModal = '';
  tituloModal = '';
  datosDelCliente: sesionModel;
  modelo: sesionModel;
  id: any;
  filtersLoaded: Promise<boolean>;

  constructor(config: NgbModalConfig, private modalService: NgbModal, public router: Router, public session: SessionService,
    private http: HttpClient, private middle: MiddleMongoService, private actRoute: ActivatedRoute) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (await this.alredySessionExist()) { return; }
    console.log('voy por los datos');
    await this.middle.getDataUser(this.id).toPromise().then(data => {
      console.log(data);
      this.datosDelCliente = data;
    });
    // this._id = this.datosDelCliente['_id'];
    console.log('el id es: ' + this.id);
    if (this.datosDelCliente === null || this.datosDelCliente === undefined
        || this.datosDelCliente['errorType'] === 'Error') {
      console.log('Error no existe');
      this.router.navigate([Rutas.error]);
    }
    console.log(this.datosDelCliente);
    this.session.updateModel(this.datosDelCliente);
    if (this.datosDelCliente.terminos === true) {
      this.router.navigate([Rutas.correo + `${this.id}`]);
    }
    this.filtersLoaded = Promise.resolve(true);
  }

  toogleCheckbox() {
    this.state.checked = !this.state.checked;
  }
  /** function to validate if user recharge page **/
  async alredySessionExist() {
    let object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      console.log('la sesion no existe');
      return false;
    } else {
      console.log('ya tengo los valores');
      if (object.terminos) {
        this.router.navigate([Rutas.correo + `${this.id}`]);
        return true;
      } else {
        return false;
      }
    }
  }

  siguiente() {
    this.datosDelCliente.terminos = true;
    this.session.updateModel(this.datosDelCliente);
    this.router.navigate([Rutas.correo + `${this.id}`]);
  }

  open(content, tipo) {
    console.log(tipo);
    if (tipo === 'terminos') {
      this.textoModal = terminosDeUso;
      this.tituloModal = 'Terminos de Uso';
    } else {
      this.textoModal = politicaDePrivacidad;
      this.tituloModal = 'Politica de Privacidad';
    }
    this.modalService.open(content);
  }

}
