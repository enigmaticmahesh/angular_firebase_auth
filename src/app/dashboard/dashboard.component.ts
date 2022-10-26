import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { COLLECTIONS } from '../common/firebaseUtils';
import { User } from '../common/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users$: Observable<User[]>;
  users: Array<User> = [];
  openModal: boolean = false;
  customerForm: FormGroup;

  constructor(private firestore: AngularFirestore) {
    this.users$ = this.firestore
      .collection<User>(COLLECTIONS.users)
      .valueChanges({ idField: '_id' });

    this.customerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.users$.subscribe({
      next: (data: Array<User>) => {
        this.users = data;
      },
      error: (err: any) => console.log({ err }),
    });
  }

  addUser() {
    if (this.customerForm.invalid) {
      return;
    }

    this.firestore
      .collection<User>(COLLECTIONS.users)
      .add(this.customerForm.value);
  }

  removeUser(id: any) {
    if (!id) {
      return;
    }

    this.firestore.doc<User>(`users/${id}`).delete();
  }

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }
}
