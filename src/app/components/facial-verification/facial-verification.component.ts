import { Component, OnInit, Input } from '@angular/core';
import { ShareFaceService } from '../../services/share/share-face.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PruebaService } from 'src/app/services/share/prueba.service';


@Component({
  selector: 'app-facial-verification',
  templateUrl: './facial-verification.component.html',
  styleUrls: ['./facial-verification.component.css']
})
export class FacialVerificationComponent implements OnInit {
  filtersLoaded: Promise<boolean>;
  @Input() public foto: any;
  constructor() { }

  async ngOnInit() {
    console.log(this.foto);
    this.foto = await this.blobToBase64(this.foto);
    this.filtersLoaded = Promise.resolve(true);
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result.toString().replace('data:image/jpeg;base64,', ''));
        };
      } catch (err) {
        reject(err);
      }
    });
  }


}
