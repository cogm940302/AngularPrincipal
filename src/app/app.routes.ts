import { PlantillaComponent } from './components/plantilla.component';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './components/terms/terms.component';
import { CorreoVerificacionComponent } from './components/correo-verificacion/correo-verificacion.component';
import { InstruccionesComponent } from './components/daon/instrucciones/instrucciones.component';
import { SesionIniciadaComponent } from './components/sesion-iniciada/sesion-iniciada.component';
import { FinalComponent } from './components/final/final.component';
import { PageFaceCaptureComponent } from './components/daon/page-face-capture/page-face-capture.component';

import { VerifyIdentityComponent } from './components/daon/document-verification/verify-identity/verify-identity.component';
import { CaptureInstructionComponent } from './components/daon/document-verification/capture-instruction/capture-instruction.component';
import { CaptureDocumentComponent } from './components/daon/document-verification/capture-document/capture-document.component';
import { ConfirmDocumentComponent } from './components/daon/document-verification/confirm-document/confirm-document.component';
import { LivenessInstructionComponent } from './components/daon/liveness-verification/liveness-instruction/liveness-instruction.component';
import { FacialVerificationComponent } from './components/daon/facial-verification/facial-verification.component';
import { ErrorComponent } from './components/error/error.component';


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
          {path: 'daon/instruction/:id', component: InstruccionesComponent},
          {path: 'daon/selfie/:id', component: PageFaceCaptureComponent},
          {path: 'daon/selfie/verification/:id', component: FacialVerificationComponent},
          {path: 'daon/document/identity/:id', component: VerifyIdentityComponent},
          {path: 'daon/document/instruction/:id', component: CaptureInstructionComponent},
          {path: 'daon/document/capture/:id', component: CaptureDocumentComponent},
          {path: 'daon/document/confirm/:id', component: ConfirmDocumentComponent},
          {path: 'daon/liveness/instruction/:id', component: LivenessInstructionComponent},
          {path: 'sesion/:id', component: SesionIniciadaComponent},
          {path: 'correo/:id', component: CorreoVerificacionComponent},
          {path: 'terminos/:id', component: TermsComponent},
          {path: 'error', component: ErrorComponent},
          {path: 'final', component: FinalComponent},
          {path: '**', component: ErrorComponent}
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
