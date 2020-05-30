import { Component, OnInit } from '@angular/core';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session/session.service';
import { MiddleDaonService } from 'src/app/services/http/middle-daon.service';
import { sesionModel } from '../../model/sesion/SessionPojo';
import { MiddleMongoService } from '../../services/http/middle-mongo.service';
import { environment } from '../../../environments/environment';
import { FP } from '@fp-pro/client';
import { ɵAnimationGroupPlayer } from '@angular/animations';
import { Session } from 'protractor';
//import { type } from 'os';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']

})
export class PersonComponent implements OnInit {

  title = "¿Éres persona fisica o moral";
  imgUrlPersonaFisica="../../../../../assets/img/person/2.2.persona_fisica.png";
  imgUrlPersonaMoral="../../../../../assets/img/person/2.1.persona_moral.png";
  labelPersonaFisica="Persona </br> fisica  ";
  labelPersonaMoral="Persona moral";
  btnTitlePersonaFisica = "Solicitaremos tu información personal";
  btnTitlePersonaMoral = "Solicitaremos la información del representante legal";
  btnTitleContinuar = "Continuar";


  constructor(private spinner: NgxSpinnerService, public router: Router, private session: SessionService, private actRoute: ActivatedRoute, private middleDaon: MiddleDaonService,
                      private middleMongo: MiddleMongoService,) { }

  filtersLoaded: Promise<boolean>;
  errorMensaje: string;
  id: string;
  rfcModel: string;
  razonSocialModel: string;
  valorPersonaModel: string;

  async ngOnInit() {
      await this.spinner.show();
      document.getElementById("errorMessageRFC").style.display = "none";
      document.getElementById("razonSocial").style.display = "none";
      document.getElementById("errorMessageTipoPersona").style.display = "none";

      var tipoPersona: string;
      var validateRFC: boolean;
      this.actRoute.params.subscribe(params => {
        this.id = params['id'];
      });

      if (!(await this.alredySessionExist())) { return; }
      await this.spinner.hide();

    $('.eligePersona').on('click',function(event){
        //evitamos el comportamiento para los href
		event.preventDefault();

        //Sacamos el data-url para usarlo luego
		tipoPersona = $(this).attr("data-persona");

        if(tipoPersona == "fisica"){
          $('#rfc').val("");
          $('#rfc').attr('maxlength', 13);
            //Pones el color adecuado a los elementos
            $('#titleMoral').removeClass('text-danger');
            $('#borderMoral').removeClass('border-danger bg-light').addClass('border-secondary bg-white');

            $('#titleFisica').addClass('text-danger');
            $('#borderFisica').removeClass('border-secondary bg-white').addClass('border-danger bg-light');
            document.getElementById("razonSocial").style.display = "none";
            document.getElementById("errorMessageTipoPersona").style.display = "none";
            //Mostramos los campos
            $("#valorTipoPersona").val("fisica");
           }
        else if(tipoPersona == "moral"){
          $('#rfc').val("");
          $('#rfc').attr('maxlength', 12);

           //Pones el color adecuado a los elementos
            $('#titleFisica').removeClass('text-danger');
            $('#borderFisica').removeClass('border-danger bg-light').addClass('border-secondary bg-white');

            $('#titleMoral').addClass('text-danger');
            $('#borderMoral').removeClass('border-secondary bg-white').addClass('border-danger bg-light');
            document.getElementById("razonSocial").style.display = "block";
            document.getElementById("errorMessageTipoPersona").style.display = "none";
            //Mostramos los campos
            $("#valorTipoPersona").val("moral");
           };


    });

    console.log("valor de variable" + tipoPersona);
  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log("sessionDatosFiscales= " ,object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos + `/${this.id}`]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.datosFiscales) {
        this.router.navigate([Rutas.correo + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }


    async enter() {
      // patron del RFC, persona moral
      var _rfc_pattern_pm = "^(([A-Z�&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
                                             "(([A-Z�&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
                                             "(([A-Z�&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
                                             "(([A-Z�&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";
		var _rfc_pattern_pf = "^(([A-Z�&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
	  		                                 "(([A-Z�&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
	  		                                 "(([A-Z�&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
	  		                                 "(([A-Z�&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";


      var inputRFC = this.rfcModel.toUpperCase();
      //var tipoPersona = $('.eligePersona').attr("data-persona");
      var person = $('#valorTipoPersona').val();
      console.log(person);
      if(person == "fisica"){

        if (inputRFC.match(_rfc_pattern_pf)){
          console.log("La estructura de la clave de RFC es valida");
          document.getElementById("errorMessageRFC").style.display = "none";
          document.getElementById("errorMessageTipoPersona").style.display = "none";
          await this.saveDataPerson(person);

          return true;
        }else {
          console.log("La estructura de la clave de RFC fisica es INVALIDA");
          document.getElementById("errorMessageRFC").style.display = "block";

            return false;
        }
      }
      else if(person == "moral"){

        if (inputRFC.match(_rfc_pattern_pm)){

          console.log("La estructura de la clave de RFC moral es valida");
          document.getElementById("errorMessageRFC").style.display = "none";
          document.getElementById("errorMessageTipoPersona").style.display = "none";
          await this.saveDataPerson(person);

      }else {
        console.log("La estructura de la clave de RFC moral es INVALIDA");
        document.getElementById("errorMessageRFC").style.display = "block";
          return false;
      }
      }else{
        document.getElementById("errorMessageTipoPersona").style.display = "block";
        console.log("debes seleccionar un tipo de persona");
      }
  }

  async saveDataPerson(typePerson:string){
    if (typePerson == "fisica"){
      await this.spinner.show();
      const objectPer = {datosFiscales: {rfc: this.rfcModel, tipoPersona: typePerson}};
      await this.middleMongo.updateDataUser(objectPer, this.id);
      console.log('ya termine con los datos fiscales' + JSON.stringify(objectPer, null, 2));
      await this.spinner.hide();
      this.router.navigate([Rutas.telefono + `${this.id}`]);

    }else if(typePerson == "moral"){
      const objectPer = {datosFiscales: {rfc: this.rfcModel, nombre: this.razonSocialModel, tipoPersona: typePerson}};
      await this.middleMongo.updateDataUser(objectPer, this.id);
      console.log('ya termine con los datos fiscales' + JSON.stringify(objectPer, null, 2));
      var modal = document.getElementById("modalPersonaMoral");
      modal.style.display = "block";
    }


  }

  async aceptar(){
    await this.spinner.show();
    this.router.navigate([Rutas.telefono + `${this.id}`]);
    await this.spinner.hide();
  }

  async cerrarModal(){
    var modal = document.getElementById("modalPersonaMoral");
    modal.style.display = "none";
  }



}
