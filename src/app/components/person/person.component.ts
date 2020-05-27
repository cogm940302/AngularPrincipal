import { Component, OnInit } from '@angular/core';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { environment } from '../../../environments/environment';
import { FP } from '@fp-pro/client';
import { ɵAnimationGroupPlayer } from '@angular/animations';

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
  

  constructor(public router: Router, private session: SessionService, private actRoute: ActivatedRoute) { }

  filtersLoaded: Promise<boolean>;
  errorMensaje: string;
  id: string;
  
  async ngOnInit() {
      // patron del RFC, persona moral
      document.getElementById("errorMessageRFC").style.display = "none";
      document.getElementById("razonSocial").style.display = "none";
      
      var tipoPersona: String;
      var validateRFC: boolean;
      
      
      var _rfc_pattern_pm = "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

      // patron del RFC, persona fisica
      var _rfc_pattern_pf = "^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
                      "(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
                      "(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
                      "(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

    $('.eligePersona').on('click',function(event){
        //evitamos el comportamiento para los href
		event.preventDefault();

        //Sacamos el data-url para usarlo luego
		tipoPersona = $(this).attr("data-persona");
        
        if(tipoPersona == "fisica"){
            
            //Pones el color adecuado a los elementos
            $('#titleMoral').removeClass('text-danger');
            $('#borderMoral').removeClass('border-danger bg-light').addClass('border-secondary bg-white');
            
            $('#titleFisica').addClass('text-danger');
            $('#borderFisica').removeClass('border-secondary bg-white').addClass('border-danger bg-light');
            document.getElementById("razonSocial").style.display = "none";
            //Mostramos los campos
            
           } 
        else if(tipoPersona == "moral"){
           //Pones el color adecuado a los elementos
            $('#titleFisica').removeClass('text-danger');
            $('#borderFisica').removeClass('border-danger bg-light').addClass('border-secondary bg-white');
            
            $('#titleMoral').addClass('text-danger');
            $('#borderMoral').removeClass('border-secondary bg-white').addClass('border-danger bg-light');
            document.getElementById("razonSocial").style.display = "block";
            //Mostramos los campos

           };

           
        
    });

    $('#btnContinuarPerson').click(function(){
      var inputRFC = String($('#rfc').val())

      
      if(tipoPersona == "fisica"){
        console.log(tipoPersona);
        if (inputRFC.match(_rfc_pattern_pf)){
          console.log("La estructura de la clave de RFC es valida");
          
          validateRFC = true;
          return true;
        }else {
          document.getElementById("errorMessageRFC").style.display = "block";
          validateRFC = false;
            return false;
        }
      }
      else if(tipoPersona == "moral"){
        console.log(tipoPersona);
        if (inputRFC.match(_rfc_pattern_pm)){
          console.log("La estructura de la clave de RFC es valida");
          
          
          validateRFC = true
          return true;
      }else {
        document.getElementById("errorMessageRFC").style.display = "block";
          
          validateRFC = false;
          return false;
      }
      }else{
        console.log("debes seleccionar");
      }

     });

    

  }

    validaRFC(patter:string, inputRFC:string){
        var rfc = inputRFC
        if (rfc.match(patter)){
                alert("La estructura de la clave de RFC es valida");
                return true;
            }else {
                alert("La estructura de la clave de RFC es incorrecta.");
                return false;
            }
    }

  

  enter() {
    this.router.navigate([Rutas.correo + `${this.id}`]);
  }
  

}