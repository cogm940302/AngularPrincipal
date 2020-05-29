import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalModule} from 'ng2-modal';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PlantillaComponent } from './components/plantilla.component';
import { APP_ROUTING } from './app.routes';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TermsComponent } from './components/terms/terms.component';
import { CorreoVerificacionComponent } from './components/correo-verificacion/correo-verificacion.component';
import { FinalComponent } from './components/final/final.component';
import { VerifyIdentityComponent } from './components/daon/document-verification/verify-identity/verify-identity.component';
import { CaptureInstructionComponent } from './components/daon/document-verification/capture-instruction/capture-instruction.component';
import { CaptureDocumentComponent } from './components/daon/document-verification/capture-document/capture-document.component';
import { LivenessInstructionComponent } from './components/daon/liveness-verification/liveness-instruction/liveness-instruction.component';
import { ConfirmDocumentComponent } from './components/daon/document-verification/confirm-document/confirm-document.component';
import { ErrorComponent } from './components/error/error.component';
import { LivenessCaptureComponent } from './components/daon/liveness-verification/liveness-capture/liveness-capture.component';
import { LivenessResultComponent } from './components/daon/liveness-verification/liveness-result/liveness-result.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InstruccionesComponent } from './components/daon/selfie/instrucciones/instrucciones.component';
import { PageFaceCaptureComponent } from './components/daon/selfie/page-face-capture/page-face-capture.component';
import { FacialVerificationComponent } from './components/daon/selfie/facial-verification/facial-verification.component';
import { ValidaOcrComponent } from './components/daon/document-verification/valida-ocr/valida-ocr.component';
import { CorreoComponent } from './components/verificacion/correo/correo.component';
import { FooterComponent } from './components/compartidos/footer/footer.component';
import { HeaderComponent } from './components/compartidos/header/header.component';
import { PlantillaSdkDaonComponent } from './components/plantillas/plantilla-sdk-daon/plantilla-sdk-daon.component';
import { CuentaClabeComponent } from './components/verificacion/cuenta-clabe/cuenta-clabe.component';
import { PersonComponent } from './components/person/person.component';
import { CellPhoneComponent } from './components/cell-phone/cell-phone.component';
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
    ValidaOcrComponent,
    CorreoComponent,
    FooterComponent,
    HeaderComponent,
    PlantillaSdkDaonComponent,
    CuentaClabeComponent,
    PersonComponent,
    CellPhoneComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    APP_ROUTING,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
