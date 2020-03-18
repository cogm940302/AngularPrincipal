import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { politicaDePrivacidad, terminosDeUso } from '../../model/documentos/aceptacion';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MiddleMongoService } from '../../services/http/middle-mongo.service';
import { MiddleDaonService } from '../../services/http/middle-daon.service';
import { NgxSpinnerService } from 'ngx-spinner';


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
              private http: HttpClient, private middle: MiddleMongoService, private actRoute: ActivatedRoute,
              private middleDaon: MiddleDaonService, private spinner: NgxSpinnerService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (await this.alredySessionExist()) {
      return;
    }
    console.log(this.datosDelCliente);
    // this.datosDelCliente = new sesionModel()
    // this.datosDelCliente._id = this.id;
    this.session.updateModel(this.datosDelCliente);
    this.filtersLoaded = Promise.resolve(true);
    await this.spinner.hide();
  }

  toogleCheckbox() {
    this.state.checked = !this.state.checked;
  }

  /** function to validate if user recharge page **/
  async alredySessionExist() {
    this.datosDelCliente = this.session.getObjectSession();
    console.log(this.datosDelCliente);
    if (this.datosDelCliente === null || this.datosDelCliente === undefined) {
      console.log('la sesion no existe');
      this.datosDelCliente = new sesionModel();
      this.datosDelCliente = await this.middle.getDataUser(this.id);
      console.log(this.datosDelCliente);
      if (this.datosDelCliente === undefined || this.datosDelCliente._id === 'Error') {
        this.router.navigate([Rutas.error]);
        await this.spinner.hide();
        return true;
      }
      this.datosDelCliente._id = this.id;
    }
    if (!this.datosDelCliente || this.datosDelCliente._id !== this.id) {
      this.router.navigate([Rutas.error]);
      await this.spinner.hide();
      return true;
    }
    if (this.datosDelCliente.terminos) {
      this.session.updateModel(this.datosDelCliente);
      this.router.navigate([Rutas.correo + `${this.id}`]);
      return true;
    }
    return false;
  }

  async siguiente() {
    await this.spinner.show();
    this.datosDelCliente.terminos = true;
    console.log(this.datosDelCliente);
    await this.middle.updateTermsDataUser({terminos: true}, this.id);
    await this.session.updateModel(this.datosDelCliente);
    await this.spinner.hide();
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
