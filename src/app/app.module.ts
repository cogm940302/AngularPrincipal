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
import { InstruccionesComponent } from './components/daon/instrucciones/instrucciones.component';
import { FinalComponent } from './components/final/final.component';
import { PageFaceCaptureComponent } from './components/daon/page-face-capture/page-face-capture.component';
import { VerifyIdentityComponent } from './components/daon/document-verification/verify-identity/verify-identity.component';
import { CaptureInstructionComponent } from './components/daon/document-verification/capture-instruction/capture-instruction.component';
import { CaptureDocumentComponent } from './components/daon/document-verification/capture-document/capture-document.component';
import { LivenessInstructionComponent } from './components/daon/liveness-verification/liveness-instruction/liveness-instruction.component';
import { ConfirmDocumentComponent } from './components/daon/document-verification/confirm-document/confirm-document.component';
import { FacialVerificationComponent } from './components/daon/facial-verification/facial-verification.component';
import { ErrorComponent } from './components/error/error.component';
import { LivenessCaptureComponent } from './components/daon/liveness-verification/liveness-capture/liveness-capture.component';
import { LivenessResultComponent } from './components/daon/liveness-verification/liveness-result/liveness-result.component';
// import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {  NgbModal } from '../../node_modules/@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    PlantillaComponent,
    TermsComponent,
    CorreoVerificacionComponent,
    InstruccionesComponent,
    FinalComponent,
    PageFaceCaptureComponent,
    FacialVerificationComponent,
    VerifyIdentityComponent,
    CaptureInstructionComponent,
    CaptureDocumentComponent,
    ConfirmDocumentComponent,
    LivenessInstructionComponent,
    ErrorComponent,
    LivenessCaptureComponent,
    LivenessResultComponent,

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
