import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);
  private router = inject(Router);

  constructor() { }

  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  async toast(options?: ToastOptions) {
    const toast = await this.toastController.create(options);
    toast.present();
  }

  async presentModal(options: ModalOptions) {
    const modal = await this.modalController.create(options);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data?: any) {
    return this.modalController.dismiss(data);
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

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: "Selecciona una imagen",
      promptLabelPicture: "Toma una foto"
    });
  };
}
