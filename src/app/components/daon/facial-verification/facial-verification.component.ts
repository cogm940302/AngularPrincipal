import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Rutas } from '../../../model/RutasUtil';
import { catchError } from 'rxjs/operators';
import { SelfieSend } from 'src/app/model/DaonPojos/Selfie';
import { sesionModel } from 'src/app/model/sesion/SessionPojo';
import { SessionService } from 'src/app/services/session/session.service';
import { MiddleMongoService } from '../../../services/http/middle-mongo.service';
import { ServicesGeneralService } from  "../../../services/general/services-general.service";



@Component({
  selector: 'app-facial-verification',
  templateUrl: './facial-verification.component.html',
  styleUrls: ['./facial-verification.component.css']
})

export class FacialVerificationComponent implements OnInit {
  constructor(public serviciogeneralService:ServicesGeneralService, private router: Router, private http: HttpClient, private session: SessionService,
              private mongoMid: MiddleMongoService) { }

  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private data: SelfieSend;
  filtersLoaded: Promise<boolean>;
  @Input() public id: string;
  @Input() public foto: any;
  error: any;

  async ngOnInit() {
    //console.log(this.foto);
    this.foto = await this.blobToBase64(this.foto);
    console.log("Foto= " + this.foto);
    this.filtersLoaded = Promise.resolve(true);
  }
 
  regresar() {
    this.router.navigate([Rutas.selfie]);
  }

  enviar() {
    let jsonSendFaceDaon = {
      "url":"https://dobsdemo-idx-first.identityx-cloud.com/mitsoluciones3/IdentityXServices/rest/v1/users/QTAzC4QvQCaDUjz1d2MG74wj0A/face/samples",
      "metodo":"POST",
      "data": this.foto,
      "format": "jpg" 
    };

    this.serviciogeneralService.sendDaon(jsonSendFaceDaon).subscribe(data => {
      console.log(JSON.stringify(data, null, 2));
       if (data.errorType) {
         console.log("errorType= " + JSON.stringify(data, null, 2));
       } else {
        console.log("respuesta de la face= " + JSON.stringify(data, null, 2));
        if (data.statusCode === 200){
          this.router.navigate([Rutas.chooseIdentity+"/5e559f279279300008700482"]);
        }
       }
     });
  }

  guardar() {
    console.log('voy a enviar');
    this.enviar();
    // TODO validar el data
    // const object = this.session.getObjectSession();
    // object.daon.selfie = true;
    // this.session.updateModel(object);
    // this.mongoMid.updateDataUser(object);
    // console.log('ya termine' + JSON.stringify(object, null, 2));
    //this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
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

  back() {
    window.location.reload();
    //this.router.navigate([Rutas.selfie + `${this.id}`]);
  }


}
