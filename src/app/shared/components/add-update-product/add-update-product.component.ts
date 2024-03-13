import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)])
  })

  // ========== INJECTS ==========
  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);

  user = {} as User;

  constructor() { }

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
  }

  async takePicture() {
    const dataUrl = (await this.utilsService.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async onSubmit() {
    const isLoading = await this.utilsService.loading();
    isLoading.present();

    const { image } = this.form.value;
    let path = `users/${this.user.uid}/products`;
    let pathImage = `${this.user.uid}/${Date.now()}`;
    let urlImage = await this.firebaseService.uploadImage(pathImage, image);
    this.form.controls.image.setValue(urlImage);
    delete this.form.value.id;

    this.firebaseService.addDocument(path, this.form.value).then(async response => {
      this.utilsService.dismissModal({ success: true });
      this.utilsService.toast({ duration: 3000, message: 'Producto creado', color: 'success', position: 'bottom', icon:'checkmark-circle-outline' });

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }
  
}