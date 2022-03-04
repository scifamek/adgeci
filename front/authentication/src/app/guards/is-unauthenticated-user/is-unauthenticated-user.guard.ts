import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { STORAGE_TOKEN_KEY } from 'src/app/injection.tokens';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class IsUnauthenticatedUserGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    @Inject(STORAGE_TOKEN_KEY) private storageTokenKey: string,

    private authenticationService: AuthenticationService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let response: boolean | Observable<boolean> = new Observable<boolean>(
      (observer) => {
        const JWT = this.localStorageService.getItem(this.storageTokenKey);

        if (!JWT) {
          observer.next(true);
        } else {
          const isValid = this.authenticationService.verifyToken(JWT);
          isValid.subscribe((data) => {
            if (!data) {
              this.localStorageService.deleteItem(this.storageTokenKey);
              observer.next(true);
            } else {
              observer.next(false);
              window.dispatchEvent(
                new CustomEvent('USER-AUTHENTICATED', {
                  detail: { token: JWT },
                })
              );
              console.log('invalido');
            }
            observer.complete();
          });
        }
      }
    );

    return response;
  }
}
