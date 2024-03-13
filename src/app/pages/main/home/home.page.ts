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

  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("Entre")
    this.getProducts();
  }

  // signOut() {
  //   this.firebaseService.signOut();
  // }

  getUser(): User {
    return this.utilsService.getLocalStorage('user');
  }

  getProducts() {
    let path = `users/${this.getUser().uid}/products`;

    let products$ = this.firebaseService.getCollectionData(path).subscribe({
      next: (response: Product[]) => {
        this.products = response;
        products$.unsubscribe();
      },
      error: (error: any) => {
        products$.unsubscribe();
      }
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
