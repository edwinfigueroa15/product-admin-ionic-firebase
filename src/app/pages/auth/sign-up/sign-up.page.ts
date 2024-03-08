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

  async onSubmit() {
    const { email, password, name } = this.form.value;

    const isLoading = await this.utilsService.loading();
    isLoading.present();

    this.firebaseService.signUp({email, password} as User).then(async response => {
      await this.firebaseService.updateUser(name);
      this.utilsService.toast({ duration: 2000, message: 'Registro completado', color: 'success', position: 'bottom' })
    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' })
    }).finally(() => {
      isLoading.dismiss();
    })
  }
}
