import { Injectable } from '@angular/core';
import { Router }     from '@angular/router';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthRequestService } from './request-services/auth-request.service'

@Injectable()
export class GuestRouteGuard implements CanActivate, CanActivateChild {

  constructor(
    private auth: AuthRequestService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
    return this.auth.checkAuthenticated().take(1).map(response => {

      let js = response

      if(js){
        this.router.navigate(['management/dashboard'])
      }
      return !js
    })
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
    return this.auth.checkAuthenticated().take(1).map(response => {

      let js = response.json()

      if(js){
        this.router.navigate(['management/dashboard'])
      }
      return !js
    })
  }

}