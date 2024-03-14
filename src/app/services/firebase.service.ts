import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getFirestore, setDoc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private utilsService = inject(UtilsService);
  private angularFireAuth = inject(AngularFireAuth);
  private angularFirestore = inject(AngularFirestore);
  private angularFireStorage = inject(AngularFireStorage);

  constructor() { }

  getAuth() {
    return getAuth();
  }

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

  // ===== Recuperar contraseña =====
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ===== Cerrar sesión =====
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/auth', { replaceUrl: true });
  }

  // ===== Base de datos =====
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }


  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(response => {
      return getDownloadURL(ref(getStorage(), path));
    })
  }

  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  async deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
