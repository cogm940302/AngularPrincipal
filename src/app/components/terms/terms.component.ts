import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { politicaDePrivacidad, terminosDeUso } from '../../model/documentos/aceptacion';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { sesionModel } from 'src/app/model/sesion/terminos';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit, OnDestroy {

  textoModal = '';
  tituloModal = '';
  state = {
    checked: false,
    isAccepted: 'unset',
    termsOfUse: false,
    privacyPolicy: false
  };
  private modelo: sesionModel;
  private _id: any;
  constructor(config: NgbModalConfig, private modalService: NgbModal, public router: Router, public session: SessionService,
    private http: HttpClient) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async guardaRegistro() {
    const url = 'https://5ghhi5ko87.execute-api.us-east-2.amazonaws.com/test/usuarios';
    console.log('this.modelo');
    this.modelo = new sesionModel();
    this.modelo.terminos = true;
    console.log(this.modelo);
    console.log(JSON.stringify(this.modelo));
    return this.http.post(url, this.modelo).toPromise().then(response => {
      console.log(JSON.stringify(response));
      if (response != null) {
        this._id = response['id'];
      }
    }).catch((error: any) => {
      console.log('Hubo un error');
      console.log(error);
    }
    );
  }

  toogleCheckbox() {
    console.log('cambiare el valor');
    this.state.checked = !this.state.checked;
    console.log(this.state.checked);
    // expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
  }

  ngOnInit() {
    if (this.session.isTermsAndConditionsTrue()) {
      this.router.navigate([Rutas.correo]);
    }
  }

  ngOnDestroy(): void {
    // this.session.cleanValues();
  }

  async siguiente() {
    await this.guardaRegistro();
    this.session.setTermsAndConditionsTrue(this._id);
    this.router.navigate([Rutas.correo]);
  }

  open(content, tipo) {
    console.log(tipo);
    if (tipo === 'terminos') {
      this.textoModal = terminosDeUso;
      this.tituloModal = 'Terminos de Uso';
    }
    else {
      this.textoModal = politicaDePrivacidad;
      this.tituloModal = 'Politica de Privacidad';
    }
    this.modalService.open(content);
  }

}
