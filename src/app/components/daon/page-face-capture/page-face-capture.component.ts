
import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import * as Daonjs from '../../../../assets/js/Daon.FaceCapture.min.js';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service.js';
import { isMobile } from "../../../services/general/services-general.service";import { Rutas } from 'src/app/model/RutasUtil.js';
//import * as frameOverlayGreen from "../../../../assets/icons/frame_overlay_far_green.png";
import {ViewEncapsulation} from '@angular/core';

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
  isMobileBool:boolean;
  isEdge:boolean;
  async ngOnInit() {
    this.isMobileBool= isMobile(navigator.userAgent);
    this.isEdge = window.navigator.userAgent.indexOf("Edge") > -1;
    console.log("XXXXXXXXXXXXXXXXX");
    if (window.navigator.userAgent.indexOf("Edge") > -1) {
      this.ctx = this.canvas.nativeElement.getContext("2d");
      this.drawOutline(document.getElementById("scream"));
       //}
    }

    this.btnB=true;
    this.mensaje="Posiciona tu cara dentro del area marcada";
    this.imageData = '';
    //let img = document.getElementById("scream");
    this.videoEl = document.querySelector('video');
    // (1)
    //this.videoEl.addEventListener('play', this.f(this.videoEl,img));
    this.fc.startCamera(this.videoEl).then((response) => {
      this.onCameraStarted(this.fc,this.videoEl);
    });
    

    // this.videoEl.onloadedmetadata = () => {
      
    //  // (2)
    //  // this.canvas.nativeElement.width = this.videoEl.videoWidth;
    //  // this.canvas.nativeElement.height = this.videoEl.videoHeight;  
     
    // };

  }

  drawOutline(img) {
    
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let scale = 0.48;

    let dx = (this.canvas.nativeElement.width - img.width * scale) / 2;
    let dy = (this.canvas.nativeElement.height - img.height * scale * 3.5) / 2;
    console.log("dx= " + dx + " - dy= " + dy);
    this.ctx.globalAlpha = 0.7;
    this.ctx.drawImage(img, dx, dy,
      img.width * scale,
      img.height * scale * 3.5);
      console.log("idx= " + img.width + " - i dy= " +  img.height);
  }


  // (3)
  /**
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
   */

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
      } else if (object.daon.selfie) {
        this.router.navigate([Rutas.chooseIdentity + `/${this.id}`]);
        return false;
      } else {
        return true;
      }
    }
  }

  captura() {
   console.log();
    this.fc.stopAutoCapture();
  } 

  onCameraStarted = (fc, video) => {
    console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
    video.onloadedmetadata = () => {
      fc.startFaceDetector({
        
        urlFaceDetectorWasm: window.location.origin + '/assets/js/DaonFaceQualityLite.wasm',
        
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
    console.log("ini");
    this.btnB=false;
    console.log("ini1.5");
    this.fc.startAutoCapture(response => {
      console.log("ini2");
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
        this.mensaje = error;
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