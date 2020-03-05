import { Component, OnInit } from '@angular/core';
import { Rutas } from 'src/app/model/RutasUtil.js';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-liveness-instruction',
  templateUrl: './liveness-instruction.component.html',
  
})
export class LivenessInstructionComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  enter(){
    this.router.navigate([Rutas.livenessCapture+ `xxxxxx`]);
  }

}
