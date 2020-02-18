import { Component, OnInit } from '@angular/core';
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
  public foto: any;
  constructor(private share: PruebaService, public _DomSanitizationService: DomSanitizer) { }

  async getValue() {
    this.foto = sessionStorage.getItem('selfie');
  }

  async ngOnInit() {
    // this.foto = 'data:image/png;base64,' + this.share.foto;
    await this.getValue();
    console.log(this.foto);
    // this.foto = JSON.parse(this.share.foto);
    const fotB64 = this.share.foto;
    console.log(fotB64);
    // $('body').append(`<img src="data:image/png;base64, ${fotB64}" alt="Red dot" />`);

    // var body = $document.find('body').eq(0);
    // body.append(mover)
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
