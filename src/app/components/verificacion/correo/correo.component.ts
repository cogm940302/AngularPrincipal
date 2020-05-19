import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MiddleVerificacionService } from 'src/app/services/http/middle-verificacion.service';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

  constructor(private middleVerifica: MiddleVerificacionService) { }

  @Output() resultValidation = new EventEmitter<string>();
  filtersLoaded: Promise<boolean>;
  codigoText = '';
  @Input() id;
 
  ngOnInit() {
    this.filtersLoaded = Promise.resolve(true);
  }

  onSearchChange(searchValue: string): void {
    this.codigoText = searchValue;
  }

  async validaCodigo() {

    const result = await this.middleVerifica.validaCodigoEmail(this.id, this.codigoText);
    console.log("result= " + result + " - " + this.id +" - " + this.codigoText)
    if (result === 200) {
      this.resultValidation.emit('OK');
    } else {
      this.resultValidation.emit('FALSE');
    }
  }

}
