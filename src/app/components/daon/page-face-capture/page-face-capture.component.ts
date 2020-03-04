import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import * as Daonjs from '../../../../assets/js/Daon.FaceCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service.js';
import { Rutas } from 'src/app/model/RutasUtil.js';


// TODO verificar las rutas de los archivos
@Component({
  selector: 'app-page-face-capture',
  templateUrl: './page-face-capture.component.html',
  styleUrls: ['./page-face-capture.component.css']
})
export class PageFaceCaptureComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  

  constructor(private router: Router, private session: SessionService, private actRoute: ActivatedRoute) {

    this.fc = new Daonjs.Daon.FaceCapture({
      url: 'https://dobsdemo-facequality-first.identityx-cloud.com/rest/v1/quality/assessments'
    });
  }

  activator = true;
  imageData: any;
  id: string;
  fc: any;
  videoEl: any;
  ctx: CanvasRenderingContext2D;
  imageGreen:any;
  img:any;
  mensaje: string;
  btnB:boolean;
  f=(videoEl1,img) => {
    let c2=this.canvas;
    function step() {
      let ctx = c2.nativeElement.getContext('2d');
      ctx.drawImage(videoEl1, 0, 0, c2.nativeElement.width, c2.nativeElement.height);
      ctx.drawImage(img, -150, -330, c2.nativeElement.width*1.5, c2.nativeElement.height*2.4);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  async ngOnInit() {
    this.btnB=true;
    this.mensaje="Posiciona tu cara dentro del area marcada";
    this.imageData = '';
    let img = document.getElementById("scream");
    this.videoEl = document.querySelector('video');
    this.videoEl.addEventListener('play', this.f(this.videoEl,img));
    this.fc.startCamera(this.videoEl).then((response) => {
      
    });

    this.videoEl.onloadedmetadata = () => {
      this.canvas.nativeElement.width = this.videoEl.videoWidth;
      this.canvas.nativeElement.height = this.videoEl.videoHeight;  
     
    };

  }

  async alredySessionExist() {
    const object = this.session.getObjectSession();
    console.log(object);
    if (object === null || object === undefined) {
      this.router.navigate([Rutas.terminos + `${this.id}`]);
      return false;
    } else {
      if (object._id !== this.id) {
        this.router.navigate([Rutas.error]);
        return false;
      } else if (object.selfie !== null && object.selfie !== undefined && object.selfie !== '') {
        this.router.navigate([Rutas.chooseIdentity + `${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  captura() {
    this.fc.stopAutoCapture();
  }

  onCameraStarted = (fc, video) => {
    video.onloadedmetadata = () => {
      fc.startFaceDetector({
        urlFaceDetectorWasm: 'https://dobsdemo-facequality-first.identityx-cloud.com/DaonFaceQualityLite.wasm',
        onFaceDetectorInitialized: () => {
          fc.findFace();
        },
        onFaceDetectorError: (err) => {
          console.error('DEMO FaceDetector error', err);
        },
        onFaceDetection: coords => {
          if (coords) {
            console.log('las coordenadas son: ');
            console.log(coords);
          } else {
            console.log('volviendo a llamar');
          }
        }
      });
    };
  }
  tomarSelfie() {
    this.btnB=false;
    this.fc.startAutoCapture(response => {
        
      console.log("R = " + JSON.stringify(response, null, 2));
      
      if (response.result === 'FAIL') {
        this.mensaje = response.feedback;
        console.log('no pasa');
      } else if (response.result === 'PASS') {
        console.log('si pasa');
        this.mensaje = response.feedback;
        this.fc.stopAutoCapture();
        this.imageData = response.sentBlobImage;
        this.activator = false;
      }
    },
      (error) => {
        console.log('error durante la captura');
        console.log(error);
        this.btnB=true;
      });
  }

  imprimirImagen() {
    return this.imageData;
  }
}
export class Square {
  constructor(private ctx: CanvasRenderingContext2D) {}
  draw(x: number, y: number, z: number) {
    this.ctx.fillRect(z * x, z * y, z, z);
  }
}