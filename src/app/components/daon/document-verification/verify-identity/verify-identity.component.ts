import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesGeneralService } from  "../../../../services/general/services-general.service";

@Component({
  selector: 'app-verify-identity',
  templateUrl: './verify-identity.component.html',
})
export class VerifyIdentityComponent implements OnInit {

  typeIdentity:String;
  constructor(public router:Router, public ServicesGeneralService:ServicesGeneralService) { }

  ngOnInit() {
  }

  agregarOferta(ti){
    this.typeIdentity = ti;
    console.log("ti= " + this.typeIdentity );
    this.ServicesGeneralService.settI(this.typeIdentity);
    this.ServicesGeneralService.setFrontAndBack("front");
    this.router.navigate(['/services/document/instruction']);
  }

}
