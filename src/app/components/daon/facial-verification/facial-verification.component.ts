import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Rutas } from '../../../model/RutasUtil';
import { catchError } from 'rxjs/operators';
import { SelfieSend } from 'src/app/model/DaonPojos/Selfie';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { SessionService } from 'src/app/services/session/session.service';
import { MiddleMongoService } from '../../../services/http/middle-mongo.service';



@Component({
  selector: 'app-facial-verification',
  templateUrl: './facial-verification.component.html',
  styleUrls: ['./facial-verification.component.css']
})

export class FacialVerificationComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private session: SessionService,
              private mongoMid: MiddleMongoService) { }

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private data: SelfieSend;
  filtersLoaded: Promise<boolean>;
  @Input() public id: string;
  @Input() public foto: any;
  error: any;

  async ngOnInit() {
    console.log(this.foto);
    this.foto = await this.blobToBase64(this.foto);
    console.log(this.foto);
    this.filtersLoaded = Promise.resolve(true);
  }

  regresar() {
    this.router.navigate([Rutas.selfie]);
  }

  enviar() {
    const url = `https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/IdentityXServices/rest/v1/users/QTAznsU-sPmUj0XyvprQAjjE4Q/face/samples`;
    this.headers.set('Authorization', 'Basic ' + btoa('luis.maciel@mitec.com.mx' + ':' + 'wUSgYlzyEgNc7fiTrv'));
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.data = new SelfieSend();
    this.data.data = this.foto;
    return this.http.post(url, this.data, { headers: this.headers }).pipe(
      catchError(this.error)
    );
  }

  guardar() {
    console.log('voy a enviar');
    let respuesta;
    this.enviar().subscribe(data => {
      console.log('ya constesto');
      console.log(data);
      respuesta = data;
    });
    // TODO validar el data
    const object = this.session.getObjectSession();
    object.daon.selfie = true;
    this.session.updateModel(object);
    this.mongoMid.updateDataUser(object);
    console.log('ya termine');
    this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result.toString().replace('data:image/jpeg;base64,', ''));
        };
      } catch (err) {
        reject(err);
      }
    });
  }


}
