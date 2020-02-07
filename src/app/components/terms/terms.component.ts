import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { politicaDePrivacidad, terminosDeUso } from '../../model/documentos/aceptacion';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {


  textoModal = '';
  tituloModal = '';
  state = {
    checked: false,
    isAccepted: 'unset',
    termsOfUse: false,
    privacyPolicy: false
  };

  constructor(config: NgbModalConfig, private modalService: NgbModal, public router: Router) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  toogleCheckbox() {
    console.log('cambiare el valor');
    this.state.checked = !this.state.checked;
    console.log(this.state.checked);
    // expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
  }

  ngOnInit() {
    // expect(element(by.css('button')).getAttribute('disabled')).toBeTruthy();
  }

  siguiente() {
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
