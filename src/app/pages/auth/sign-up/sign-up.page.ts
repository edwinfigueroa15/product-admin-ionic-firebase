import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  // ========== INJECTS ==========
  private firebaseService = inject(FirebaseService)
  private utilsService = inject(UtilsService)

  constructor() { }

  ngOnInit() {
  }

  async setUserInfo(uid: string) {
    const isLoading = await this.utilsService.loading();
    isLoading.present();

    let path = `users/${uid}`;
    delete this.form.value.password;

    this.firebaseService.setDocument(path, this.form.value).then(async response => {
      this.utilsService.saveLocalStorage('user', this.form.value);
      this.utilsService.routerLink('/main/home');
      this.form.reset();
      this.utilsService.toast({ duration: 2000, message: 'Registro completado', color: 'success', position: 'bottom' });
      
    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });
      
    }).finally(() => {
      isLoading.dismiss();
    })
  }

  async onSubmit() {
    const { email, password, name } = this.form.value;

    const isLoading = await this.utilsService.loading();
    isLoading.present();

    this.firebaseService.signUp({email, password} as User).then(async response => {
      this.form.controls['uid'].setValue(response.user.uid);
      await this.firebaseService.updateUser(name);
      await this.setUserInfo(response.user.uid);

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }
}
