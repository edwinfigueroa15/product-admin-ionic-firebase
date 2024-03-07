import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);

  constructor() { }

  loading() {
    return this.loadingController.create({ spinner: 'crescent' })
  }

  async toast(options?: ToastOptions) {
    const toast = await this.toastController.create(options);
    toast.present();
  }
}
