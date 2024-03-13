import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;

  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  getUser(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async confirmDeleteProduct(product: Product) {
    await this.utilsService.presentAlert({
      header: 'Eliminar',
      message: '¿Quieres eliminar este producto?',
      buttons: [
        {
          text: 'Cancel',
        }, 
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }

  getProducts() {
    this.isLoading = true;
    let path = `users/${this.getUser().uid}/products`;

    let products$ = this.firebaseService.getCollectionData(path).subscribe({
      next: (response: Product[]) => {
        this.products = response;
        this.isLoading = false;
        products$.unsubscribe();
      },
      error: (error: any) => {
        products$.unsubscribe();
      }
    })
  }

  async deleteProduct(product: Product) {
    const isLoading = await this.utilsService.loading();
    isLoading.present();

    let pathImage = await this.firebaseService.getFilePath(product.image);
    await this.firebaseService.deleteFile(pathImage);
    
    let path = `users/${this.getUser().uid}/products/${product.id}`;
    this.firebaseService.deleteDocument(path).then(async response => {
      this.utilsService.toast({ duration: 3000, message: 'Producto eliminado', color: 'success', position: 'bottom', icon:'checkmark-circle-outline' });

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      this.products = this.products.filter(item => item.id != product.id);
      isLoading.dismiss();
    })
  }

  async addUpdateProduct(product?: Product) {
    const responseModal = await this.utilsService.presentModal({
      component: AddUpdateProductComponent,
      componentProps: { product },
      cssClass: 'add-update-modal'
    })

    if(responseModal?.success) this.getProducts();
  }

}
