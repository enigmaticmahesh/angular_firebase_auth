import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userDisplayName: string | undefined | null = '';

  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.userDisplayName = user?.displayName;
      this.isUserLoggedIn = user ? true : false;
    });
  }

  signOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err) => console.log('User signing out error: ', err));
  }
}
