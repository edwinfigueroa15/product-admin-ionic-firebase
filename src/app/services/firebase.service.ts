import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  angularFireAuth = inject(AngularFireAuth);

  constructor() { }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }
}