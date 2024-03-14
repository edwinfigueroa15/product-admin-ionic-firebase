import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

interface Menu {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  user = null as User;
  currentPath: string = '';
  pages: Menu[] = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' }
  ]

  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);
  router = inject(Router);

  constructor() { }

  ngOnInit() {
    const { displayName, email, uid } = this.firebaseService.getAuth().currentUser
    this.user = {
      uid,
      name: displayName,
      email,
    }

    this.router.events.subscribe((event: any) => {
      if(event?.url) this.currentPath = event?.url;
    })

    setTimeout(() => {
      this.user = this.utilsService.getLocalStorage('user');
    }, 2500)
  }

  signOut() {
    this.firebaseService.signOut();
  }
}
