import { Component, OnInit } from '@angular/core';
import { ShareFaceService } from '../../services/share/share-face.service';

@Component({
  selector: 'app-facial-verification',
  templateUrl: './facial-verification.component.html',
  styleUrls: ['./facial-verification.component.css']
})
export class FacialVerificationComponent implements OnInit {
  foto = '';
  constructor(private share: ShareFaceService) { }

  ngOnInit() {
    this.foto = this.share.foto;
  }

}
