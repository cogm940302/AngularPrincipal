import { Component, OnInit } from '@angular/core';
import { ServicesGeneralService } from '../../../../services/general/services-general.service';

@Component({
  selector: 'app-liveness-result',
  templateUrl: './liveness-result.component.html',
})


export class LivenessResultComponent implements OnInit {
  result: string;
  mensaje: string;
  constructor(public serviciogeneralService: ServicesGeneralService) { }

  ngOnInit() {
    this.result = this.serviciogeneralService.getResultLiveness();
    this.mensaje = this.serviciogeneralService.getMensajeLiveness();
  }

}
