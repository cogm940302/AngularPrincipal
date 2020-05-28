import { Component, OnInit } from '@angular/core';
import { FP } from '@fp-pro/client';
import { NgxSpinnerService } from 'ngx-spinner';
import { Rutas } from '../../model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { sesionModel } from '../../model/sesion/SessionPojo';

@Component({
  selector: 'app-cell-phone',
  templateUrl: './cell-phone.component.html',
  styleUrls: ['./cell-phone.component.css']
})
export class CellPhoneComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private actRoute: ActivatedRoute,
    private session: SessionService, private router: Router ) { }

  object: sesionModel;
  filtersLoaded: Promise<boolean>;
  id: any;
  telefonoModel: string;

  async ngOnInit() {
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
    this.object = this.session.getObjectSession();
    console.log("***object***")
    console.log(this.object);
    if (this.object === null || this.object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      if (this.object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (this.object.telefono !== null && this.object.telefono &&
                 this.object.correo !== undefined && this.object.correo) {
        console.log('voy a instrucciones');
        this.router.navigate([Rutas.instrucciones + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  aceptar(){
    
    if(this.telefonoModel.match("([0-9]{10})")){
      console.log(">> S = " + this.telefonoModel);
      //document.getElementById("errorMessageTEL").style.display = "none";
    }else{
      console.log(">> N = " + this.telefonoModel);
      //document.getElementById("errorMessageTEL").style.display = "block";
    }
  }

}
