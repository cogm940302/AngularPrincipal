import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service.js';
import { Router, ActivatedRoute } from '@angular/router';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-cuenta-clabe',
  templateUrl: './cuenta-clabe.component.html',
  styleUrls: ['./cuenta-clabe.component.css']
})

export class CuentaClabeComponent implements OnInit {

  id: string;
  constructor(private session: SessionService, public router: Router,
    private actRoute: ActivatedRoute) {}
    
    myForm:any;
    isOK=false;
    submitted = false;
    async ngOnInit() {
      this.myForm = new FormGroup({
        cuentaClabe: new FormControl('', [this.IsValidated(), Validators.minLength(18),Validators.maxLength(18), Validators.required, Validators.pattern("[0-9]*")])
      });    
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    if (!(await this.alredySessionExist())) { return; }
  }

  get f(){
    return this.myForm.controls;
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
        this.router.navigate([Rutas.fin]);
        return false;
      } else {
        return true;
      }
    }
  }
 
  onSubmit() {
    this.submitted = true;
    if (this.myForm.invalid) {
        return;
    }
  }

  onReset() {
      this.submitted = false;
      this.myForm.reset();
  }

  continuar(){
    console.log(">>> : " + this.f.cuentaClabe.value);    
    const object = this.session.getObjectSession();
    object.daon.pruebaVida = true;
    //object.estatus = 'Terminado';
    /*this.session.updateModel(object);
    await this.middleDaon.updateDaonDataUser(object, this.id);
    await this.middleDaon.getResults(this.id);
    this.fc.stopCamera();
    this.f3d.terminate();
    console.log('ya termine' + JSON.stringify(object, null, 2));
    this.router.navigate([Rutas.cuentaClabe+ `/${this.id}`]);
*/
  }



  CLABE_LENGTH = 18;
  CLABE_WEIGHTS = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  getDc(clabe){
    const clabeList = clabe.split("");
    const clabeInt = clabeList.map((i) => Number(i));
    const weighted = [];
    for(var i = 0; i < this.CLABE_LENGTH - 1; i++) {
      weighted.push(clabeInt[i] * this.CLABE_WEIGHTS[i] % 10);
    }
    const summed = weighted.reduce((curr, next) => curr + next) % 10;
    const controlDigit = (10 - summed) % 10;
    return controlDigit.toString();
  }
  
  validaClabe(clabe){
    return this.isANumber(clabe) &&
    clabe.length === this.CLABE_LENGTH  &&
    clabe.substring(this.CLABE_LENGTH - 1) === this.getDc(clabe);
  }
  isANumber(str){
    return !/\D/.test(str);
  }

  IsValidated(): ValidatorFn {
    return () => {
      if(this.myForm!==undefined)
      {        
      if (!this.validaClabe(this.f.cuentaClabe.value) && this.submitted) {
        return { valid: true };
      } else {
        return null;
      }
    }else{
      return null;
    }
    };
  }
}
