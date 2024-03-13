import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

type returnCanActivate = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);
  
  canActivate(route: ActivatedRouteSnapshot, nstate: RouterStateSnapshot): returnCanActivate {
    let user = this.utilsService.getLocalStorage('user');

    return new Promise((resolve, reject) => {
      this.firebaseService.getAuth().onAuthStateChanged(auth => {
        if (!auth) {
          resolve(true);
        } else {
          this.utilsService.routerLink('/main/home');
          resolve(false);
        }
      })
    })
  }
  
}
