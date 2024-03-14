import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

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
  currentPath: string = '';
  pages: Menu[] = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' }
  ]

  private firebaseService = inject(FirebaseService);
  router = inject(Router);

  constructor() { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event?.url) this.currentPath = event?.url;
    })
  }

  signOut() {
    this.firebaseService.signOut();
  }
}
