import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  REGISTRATION_CONTROLS = [
    {
      controlName: 'confirmPassword',
      validators: [Validators.required, this.confirmPasswordValidator()],
      placeHolder: 'Confirm Password',
    },
    {
      controlName: 'name',
      validators: [Validators.required],
      placeHolder: 'Your Full Name',
    },
    {
      controlName: 'mobile',
      validators: [Validators.required],
      placeHolder: 'Your Mobile Number',
    },
  ];
  loginForm: FormGroup;
  userRegistering: boolean = false;
  googleAuth: any;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private appService: AppService,
    private firestore: AngularFirestore
  ) {
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
      this.REGISTRATION_CONTROLS.forEach((item) => {
        this.loginForm.addControl(
          item.controlName,
          new FormControl('', item.validators)
        );
      });
      return;
    }

    if (!this.userRegistering && this.loginForm.contains('confirmPassword')) {
      this.REGISTRATION_CONTROLS.forEach((item) => {
        this.loginForm.removeControl(item.controlName);
      });
      return;
    }
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
      if (!confirmPassword) {
        return null;
      }
      return this.loginForm.get('password')?.value === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
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
