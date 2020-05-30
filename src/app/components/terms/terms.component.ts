import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { HttpClient } from '@angular/common/http';
import { MiddleMongoService } from '../../services/http/middle-mongo.service';
import { MiddleDaonService } from '../../services/http/middle-daon.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  textoModal = '';
  tituloModal = '';
  datosDelCliente: sesionModel;
  modelo: sesionModel;
  id: any;
  filtersLoaded: Promise<boolean>;
  oferta: string;
  apiToken: string;

  constructor(config: NgbModalConfig, private modalService: NgbModal, public router: Router, public session: SessionService,
              private http: HttpClient, private middle: MiddleMongoService, private actRoute: ActivatedRoute,
              private middleDaon: MiddleDaonService, private spinner: NgxSpinnerService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    await this.spinner.show();
    this.actRoute.queryParams.subscribe(params => {
      this.oferta = params['oferta'];
      this.apiToken = params['apiToken'];
  });
    if (!this.oferta || !this.apiToken) {
      await this.goToErrorPage();
      return;
    }
    await this.initSessionValues();
    console.log(this.datosDelCliente);
    this.session.updateModel(this.datosDelCliente);
    this.filtersLoaded = Promise.resolve(true);
    await this.spinner.hide();
  }

  async initSessionValues() {
    this.session.cleanValues();
    this.datosDelCliente = new sesionModel();
    this.id = await this.middle.creaTrackId(this.oferta, this.apiToken);
    if (!this.id) {
      await this.goToErrorPage();
    }
    this.datosDelCliente._id = this.id;
  }

  async goToErrorPage() {
    await this.spinner.hide();
    this.router.navigate([Rutas.error]);
  }

  async siguiente() {
    await this.spinner.show();
    this.datosDelCliente.terminos = true;
    console.log(this.datosDelCliente);
    await this.middle.updateTermsDataUser({ terminos: true }, this.id);
    await this.session.updateModel(this.datosDelCliente);
    await this.spinner.hide();
    this.router.navigate([Rutas.person + `${this.id}`]);
  }


}
