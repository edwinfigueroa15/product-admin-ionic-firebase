import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);

  constructor() { }

  loading() {
    return this.loadingController.create({ spinner: 'crescent' })
  }
}
