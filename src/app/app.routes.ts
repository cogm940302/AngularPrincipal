import { PlantillaComponent } from './components/plantilla.component';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './components/terms/terms.component';
import { CorreoVerificacionComponent } from './components/correo-verificacion/correo-verificacion.component';
import { InstruccionesComponent } from './components/daon/instrucciones/instrucciones.component';
import { SesionIniciadaComponent } from './components/sesion-iniciada/sesion-iniciada.component';
import { FinalComponent } from './components/final/final.component';
import { PageFaceCaptureComponent } from './components/daon/page-face-capture/page-face-capture.component';
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
          {path: 'daon/instrucciones/:id', component: InstruccionesComponent},
          {path: 'daon/selfie/:id', component: PageFaceCaptureComponent},
          {path: 'sesion/:id', component: SesionIniciadaComponent},
          {path: 'correo/:id', component: CorreoVerificacionComponent},
          {path: 'daon/facial/verification/:id', component: FacialVerificationComponent},
          {path: 'terminos/:id', component: TermsComponent},
          {path: 'error', component: ErrorComponent},
          {path: 'final', component: FinalComponent},
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
