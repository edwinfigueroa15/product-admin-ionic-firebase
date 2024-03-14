import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = {} as User;
  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)])
  })

  // ========== INJECTS ==========
  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);

  constructor() { }

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
  }

  async getUserInfo(uid: string) {
    const isLoading = await this.utilsService.loading();
    isLoading.present();

    let path = `users/${uid}`;

    this.firebaseService.getDocument(path).then((response: User) => {
      this.user = response;
      this.utilsService.saveLocalStorage('user', response);
      this.utilsService.toast({ duration: 3000, message: 'Imagen de perfil actualizada', color: 'success', position: 'bottom', icon: 'checkmark-circle-outline' });

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }

  async takePicture() {
    const isLoading = await this.utilsService.loading();
    isLoading.present();

    try {
      const dataUrl = (await this.utilsService.takePicture('Imagen del perfil')).dataUrl;
      let pathImage = `${this.user.uid}/profile`;
      this.user.image = await this.firebaseService.uploadImage(pathImage, dataUrl);
    } catch {
      isLoading.dismiss();
      return;
    }

    let path = `users/${this.user.uid}`;
    this.firebaseService.updateDocument(path, { image: this.user.image }).then(async response => {
      this.getUserInfo(this.user.uid);

    }).catch(error => {
      isLoading.dismiss();
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }

}
