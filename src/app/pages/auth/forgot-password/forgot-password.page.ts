import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  // ========== INJECTS ==========
  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  async onSubmit() {
    const { email } = this.form.value;

    const isLoading = await this.utilsService.loading();
    isLoading.present();

    this.firebaseService.sendRecoveryEmail(email).then(response => {
      this.utilsService.routerLink('/auth');
      this.utilsService.toast({ duration: 3000, message: 'Se envió el enlace de recuperación al correo', color: 'success', position: 'bottom' });

    }).catch(error => {
      this.utilsService.toast({ duration: 3000, message: error.message, color: 'danger', position: 'bottom' });

    }).finally(() => {
      isLoading.dismiss();
    })
  }

}
