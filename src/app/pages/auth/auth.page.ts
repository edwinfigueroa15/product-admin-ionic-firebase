import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('edwinfigueroa15.15@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('12345678', [Validators.required])
  })

  // ========== INJECTS ==========
  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  // Obteniendo la informacion del usuario de la base de datos de firebase
  async getUserInfo(uid: string) {
    const isLoading = await this.utilsService.loading();
    isLoading.present();

    let path = `users/${uid}`;

    this.firebaseService.getDocument(path).then(response => {
      this.form.reset();
      this.utilsService.routerLink('/main/home');
      this.utilsService.toast({ duration: 2000, message: 'Bienvenid@', color: 'success', position: 'bottom' });

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }

  async onSubmit() {
    
    const { email, password } = this.form.value;

    const isLoading = await this.utilsService.loading();
    isLoading.present();

    this.firebaseService.signIn({ email, password } as User).then(response => {
      const user = {
        uid: response.user.uid,
        name: response.user.displayName,
        email: response.user.email
      }

      this.utilsService.saveLocalStorage('user', user);
      this.getUserInfo(response.user.uid);
      isLoading.dismiss();

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }
}
