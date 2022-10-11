import { Component } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from "@angular/router";
import { AppService } from "src/app/app.service";
import firebase from 'firebase/compat/app';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup
    userRegistering: boolean = false
    googleAuth: any

    constructor(private auth: AngularFireAuth, private router: Router, private appService: AppService) {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)])
        })
    }

    loginUser() {
        if (this.loginForm.invalid) {
            return
        }
        
        const {email, password} = this.loginForm.value
        this.appService.startLoading()
        this.auth.signInWithEmailAndPassword(email, password)
        .then((loggedInData) => {
            this.router.navigate(['/dashboard'])
        })
        .catch(err => console.log('Firebase login error: ', err))
        .finally(() => this.appService.stopLoading())
    }

    registerUser() {
        if (this.loginForm.invalid) {
            return
        }
        
        const {email, password} = this.loginForm.value
        this.appService.startLoading()
        this.auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => console.log({userCredential}))
        .catch(err => console.log({err}))
        .finally(() => this.appService.stopLoading())
    }

    isUserRegistering() {
        this.userRegistering = !this.userRegistering
        if (this.userRegistering && !this.loginForm.contains('confirmPassword')) {
            this.loginForm.addControl('confirmPassword', new FormControl('', [Validators.required, this.confirmPasswordValidator()]))
            return
        }

        if (!this.userRegistering && this.loginForm.contains('confirmPassword')) {
            this.loginForm.removeControl('confirmPassword')
            return
        }
    }

    confirmPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const confirmPassword = control.value
            if (!confirmPassword) { return null }
            return this.loginForm.get('password')?.value === confirmPassword ? null : {passwordMismatch: true}
        }
    }

    loginWithGoogle() {
        this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(googleUser => {
            this.router.navigate(['/dashboard'])
        })
        .catch(err => console.log('Google sign in error: ', err))
    }
}