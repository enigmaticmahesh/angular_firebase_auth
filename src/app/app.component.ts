import { Component, OnInit } from '@angular/core';
import { Notify } from 'notiflix';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angularBarberApp';

  ngOnInit() {
    Notify.init({
      position: 'center-bottom',
      width: '320px',
    });
  }
}
