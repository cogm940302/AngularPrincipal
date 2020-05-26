import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service.js';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil.js';
@Component({
  selector: 'app-cuenta-clabe',
  templateUrl: './cuenta-clabe.component.html',
  styleUrls: ['./cuenta-clabe.component.css']
})


export class CuentaClabeComponent implements OnInit {
  id: string;
  constructor(private session: SessionService, public router: Router,
    private actRoute: ActivatedRoute) { 
      console.log("Ferrrrrrrrrr");
    }

    @ViewChild('cuentaClabe', { static: true }) cuentaClabe: ElementRef;

    async ngOnInit() {
      
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });

//    if (!(await this.alredySessionExist())) { return; }

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
      } else if (object.daon.cuentaClabe) {
        console.log("<<<>> " +object.daon.cuentaClabe)
        this.router.navigate([Rutas.cuentaClabe + `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  continuar(){
    console.log(this.cuentaClabe);
  }

}
