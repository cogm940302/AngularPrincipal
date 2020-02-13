import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalModule} from 'ng2-modal';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PlantillaComponent } from './components/plantilla.component';
import { APP_ROUTING } from './app.routes';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TermsComponent } from './components/terms/terms.component';
import { CorreoVerificacionComponent } from './components/correo-verificacion/correo-verificacion.component';
import { InstruccionesComponent } from './components/instrucciones/instrucciones.component';
import { SesionIniciadaComponent } from './components/sesion-iniciada/sesion-iniciada.component';
import { FinalComponent } from './components/final/final.component';
import { PageFaceCaptureComponent } from './components/daon/page-face-capture/page-face-capture.component';
// import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {  NgbModal } from '../../node_modules/@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    PlantillaComponent,
    TermsComponent,
    CorreoVerificacionComponent,
    InstruccionesComponent,
    SesionIniciadaComponent,
    FinalComponent,
    PageFaceCaptureComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    APP_ROUTING,
    ModalModule,
    NgbModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
