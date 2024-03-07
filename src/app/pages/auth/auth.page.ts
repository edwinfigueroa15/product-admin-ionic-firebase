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
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  // ========== INJECTS ==========
  private firebaseService = inject(FirebaseService)
  private utilsService = inject(UtilsService)

  constructor() { }

  ngOnInit() {
  }

  async onSubmit() {
    const { email, password } = this.form.value;

    const isLoading = await this.utilsService.loading();
    isLoading.present();

    this.firebaseService.signIn({email, password} as User).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      isLoading.dismiss();
    })
  }
}
