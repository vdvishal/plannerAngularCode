import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(private router:Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"))
      let auth = localStorage.getItem("authToken") === null || localStorage.getItem("authToken") === undefined || localStorage.getItem("authToken") === ''
      if(!auth) {
        if(userInfo.userName.includes("-admin")){
          this.router.navigate(['/admin']);
          return false
        }
        else{
          this.router.navigate(['/normal']);
          return false
        }

      }
      else{
        return true
      } 
    }
  }