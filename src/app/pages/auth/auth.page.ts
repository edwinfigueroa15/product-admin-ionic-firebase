import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

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


  firebaseService = inject(FirebaseService)

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    const { email, password } = this.form.value;
    this.firebaseService.signIn({email, password} as User).then(response => {
      console.log(response)
    }).catch(error => {
      console.error(error);
    })
  }
}
