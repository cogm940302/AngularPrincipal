import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Rutas } from 'src/app/model/RutasUtil';
import { MiddleDaonService } from 'src/app/services/http/middle-daon.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-valida-ocr',
  templateUrl: './valida-ocr.component.html',
  styleUrls: ['./valida-ocr.component.css']
})
export class ValidaOcrComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute, private session: SessionService, public router: Router,
              private middleDaon: MiddleDaonService, private spinner: NgxSpinnerService) { }

  filtersLoaded: Promise<boolean>;
  id: string;
  public nombre: string;
  public direccion: string;

  async ngOnInit() {
    await this.spinner.show();
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!await this.alredySessionExist()) { return; }
    await this.getDataOcrConsume();
  }

  async getDataOcrConsume() {
    const resultDatos = await this.middleDaon.getDataOCR(this.id);
    console.log(JSON.stringify(resultDatos) );
    if (resultDatos['error']) {
      sessionStorage.setItem('error' , resultDatos['error']);
      this.router.navigate([Rutas.error]);
      return;
    } else {
      this.nombre = resultDatos['visualZone']['25']['value'].replace('^', ' ');
      this.direccion = resultDatos['visualZone']['134873105']['value'].replace('^', ' ');
    }
    this.filtersLoaded = Promise.resolve(true);
    await this.spinner.hide();
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

  async updateValuesSession() {
    await this.spinner.show();
    const object = this.session.getObjectSession();
    object.daon.identity = true;
    this.session.updateModel(object);
    await this.middleDaon.updateDaonDataUser(object, this.id);
    this.router.navigate([Rutas.livenessInstruction + `/${this.id}`]);
    await this.spinner.hide();
  }

  async backAndTakeAgain() {
    await this.spinner.show();
    this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
    await this.spinner.hide();
  }
}
