import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor() { }

  error: string;

  ngOnInit() {
    this.error = sessionStorage.getItem('error');
    sessionStorage.clear();
  }

}
