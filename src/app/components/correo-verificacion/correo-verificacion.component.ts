import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from '../../model/RutasUtil';
import { SessionService } from '../../services/session/session.service';
import { ShareMailService } from '../../services/share/share-mail.service';

@Component({
  selector: 'app-correo-verificacion',
  templateUrl: './correo-verificacion.component.html',
  styleUrls: ['./correo-verificacion.component.css']
})
export class CorreoVerificacionComponent implements OnInit {

  constructor(private router: Router, private session: SessionService, private sharedata: ShareMailService,
              private actRoute: ActivatedRoute) { }

  correoText = '';
  id: any;

  async ngOnInit() {
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!await this.alredySessionExist()) { return; }

  }

  async alredySessionExist() {
    let object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.error]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
      } else if (object.correo !== null && object.correo !== undefined && object.correo !== '') {
        this.router.navigate([Rutas.instrucciones + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  onSearchChange(searchValue: string): void {
    this.correoText = searchValue;
  }

  validaCorreo() {
    this.sharedata.setCorreo(this.correoText);
    this.router.navigate([Rutas.sesionIniciada]);
  }
}
