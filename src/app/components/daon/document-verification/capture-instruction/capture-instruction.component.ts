import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from  "../../../../services/general/services-general.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-capture-instruction',
  templateUrl: './capture-instruction.component.html',
})
export class CaptureInstructionComponent implements OnInit {

  titulo:string;
  constructor(public router:Router, public serviciogeneralService:ServicesGeneralService) { 
    if(serviciogeneralService.gettI()!=undefined && serviciogeneralService.getFrontAndBack()!=undefined){
      sessionStorage.setItem("ti", serviciogeneralService.gettI());
      sessionStorage.setItem("fb", serviciogeneralService.getFrontAndBack());
      this.titulo= serviciogeneralService.gettI() + " 1photo page " + serviciogeneralService.getFrontAndBack();
    }else if (sessionStorage.getItem('ti') == undefined || sessionStorage.getItem('fb') == undefined){
      this.router.navigate(['']);
    }else{
      this.titulo= sessionStorage.getItem('ti') + " 2photo page " + sessionStorage.getItem('fb');
    }
  }

  ngOnInit() {
    console.log("titulo= " + this.titulo);
  }

  back(){
    this.router.navigate(['']);
  }

  captueWCamera(){
    this.router.navigate(['/services/document/capture']);
  }

}
