import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

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

  user = {} as User;

  constructor() { }

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');

    if(this.product) this.form.setValue(this.product);
  }

  async takePicture() {
    const dataUrl = (await this.utilsService.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async createProduct() {
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

  async updateProduct() {
    const isLoading = await this.utilsService.loading();
    isLoading.present();

    let path = `users/${this.user.uid}/products/${this.product.id}`;

    const { image } = this.form.value;
    if(image != this.product.image) {
      let pathImage = await this.firebaseService.getFilePath(this.product.image);
      let urlImage = await this.firebaseService.uploadImage(pathImage, image);
      this.form.controls.image.setValue(urlImage);
    }
    
    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value).then(async response => {
      this.utilsService.dismissModal({ success: true });
      this.utilsService.toast({ duration: 3000, message: 'Producto actualizado', color: 'success', position: 'bottom', icon:'checkmark-circle-outline' });

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }

  onSubmit() {
    if(this.product) this.updateProduct();
    else this.createProduct();
  }
  
}