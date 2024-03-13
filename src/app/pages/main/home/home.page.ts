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

    const products$ = this.firebaseService.getCollectionData(path).subscribe({
      next: (response: Product[]) => {
        this.products = response;
      },
      error: (error: any) => {
        products$.unsubscribe();
      },
      complete: () => {
        products$.unsubscribe();
      }
    })
  }

  addUpdateProduct() {
    this.utilsService.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal'
    })
  }

}
