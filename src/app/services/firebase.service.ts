import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, getFirestore, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private angularFireAuth = inject(AngularFireAuth);
  private angularFirestore = inject(AngularFirestore);

  constructor() { }

  // ===== Acceder =====
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ===== Registrar =====
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ===== Actualizar usuario =====
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // ===== Cerrar sesión =====

  // ===== Base de datos =====
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
}
