import { PlantillaComponent } from './components/plantilla.component';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './components/terms/terms.component';
import { CorreoVerificacionComponent } from './components/correo-verificacion/correo-verificacion.component';
import { InstruccionesComponent } from './components/instrucciones/instrucciones.component';
import { SesionIniciadaComponent } from './components/sesion-iniciada/sesion-iniciada.component';
import { FinalComponent } from './components/final/final.component';
import { PageFaceCaptureComponent } from './components/daon/page-face-capture/page-face-capture.component';
import { FacialVerificationComponent } from './components/facial-verification/facial-verification.component';
import { VerifyIdentityComponent } from './components/daon/document-verification/verify-identity/verify-identity.component';
import { CaptureInstructionComponent } from './components/daon/document-verification/capture-instruction/capture-instruction.component';
import { CaptureDocumentComponent } from './components/daon/document-verification/capture-document/capture-document.component';
import { ConfirmDocumentComponent } from './components/daon/document-verification/confirm-document/confirm-document.component';
import { LivenessInstructionComponent } from './components/daon/liveness-verification/liveness-instruction/liveness-instruction.component';

const APP_ROUTES: Routes = [
  {
      path: '',
      redirectTo: '/services',
      pathMatch: 'full'
  },
  {
      path: 'services',
      component: PlantillaComponent,
      children: [
          {path: 'instrucciones', component: InstruccionesComponent},
          {path: 'selfie', component: PageFaceCaptureComponent},
          {path: 'terminos', component: TermsComponent},
          {path: 'sesion', component: SesionIniciadaComponent},
          {path: 'correo', component: CorreoVerificacionComponent},
          {path: 'final', component: FinalComponent},
          {path: 'facial/verification', component: FacialVerificationComponent},
          {path: 'document/identity', component: VerifyIdentityComponent},
          {path: 'document/instruction', component: CaptureInstructionComponent},
          {path: 'document/capture', component: CaptureDocumentComponent},
          {path: 'document/confirm', component: ConfirmDocumentComponent},
          {path: 'liveness/instruction', component: LivenessInstructionComponent},
          {path: '**', component: TermsComponent}
      ]
  },
];

const routes: Routes = [
  {
      path: '',
      children: [
          ...APP_ROUTES,
          {
              path: '',
              component: TermsComponent
          }
      ]
  },
];

export const appRoutingProviders: any[] = [];
export const APP_ROUTING = RouterModule.forRoot(routes);
