import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css']
})
export class PlantillaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("inicio");
    $("app-plantilla").attr("class","my-auto");
    //$("body").attr("class","mx-auto bg-white rounded-lg");
    $("body").attr("class","d-flex flex-column h-100 bg-secondary");
    
    var DEBUG = false;
    // ENABLE/DISABLE Console Logs
    if(!DEBUG){
      console.log = function() {}
    }
  }

}
