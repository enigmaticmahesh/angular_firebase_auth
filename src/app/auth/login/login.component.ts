import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Notify } from 'notiflix';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { AppService } from 'src/app/app.service';
import { User } from 'src/app/common/interfaces';
import { COLLECTIONS } from 'src/app/common/firebaseUtils';
import { REGISTRATION_CONTROLS } from 'src/app/common/utils'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  userRegistering: boolean = false;
  googleAuth: any;
  registrationControls = REGISTRATION_CONTROLS

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private appService: AppService,
    private firestore: AngularFirestore
  ) {
    // Login Form
    this.loginForm = new FormGroup({
      email: new FormControl('test@test.com', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('test@test', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.appService.startLoading();
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then((loggedInData) => {
        Notify.success(
          `Welcome to Dashboard ${loggedInData.user?.displayName}`
        );
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        console.log('Firebase login error');
        console.log({ err });
        Notify.failure(err.message);
      })
      .finally(() => this.appService.stopLoading());
  }

  registerUser() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.appService.startLoading();
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = {
          name: this.loginForm.get('name')?.value,
          mobile: this.loginForm.get('mobile')?.value,
        };

        this.firestore
          .collection<User>(COLLECTIONS.users)
          .doc(userCredential.user!.uid)
          .set(user);
        try {
          await userCredential.user?.updateProfile({ displayName: user.name });
        } catch (error) {
          Notify.failure('Error while updating your profile name');
        }
        Notify.success(
          `Welcome to Dashboard ${userCredential.user?.displayName}`
        );
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        console.log({ err });
        Notify.failure(err.message);
      })
      .finally(() => this.appService.stopLoading());
  }

  isUserRegistering() {
    this.userRegistering = !this.userRegistering;
    if (this.userRegistering && !this.loginForm.contains('confirmPassword')) {
      REGISTRATION_CONTROLS.forEach((item) => {
        this.loginForm.addControl(
          item.controlName,
          new FormControl('', item.validators)
        );
      });
      return;
    }

    if (!this.userRegistering && this.loginForm.contains('confirmPassword')) {
      REGISTRATION_CONTROLS.forEach((item) => {
        this.loginForm.removeControl(item.controlName);
      });
      return;
    }
  }

  loginWithGoogle() {
    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((googleUser) => {
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => console.log('Google sign in error: ', err));
  }
}
