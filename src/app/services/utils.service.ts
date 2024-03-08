import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);
  private router = inject(Router);

  constructor() { }

  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  async toast(options?: ToastOptions) {
    const toast = await this.toastController.create(options);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  saveLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
}
