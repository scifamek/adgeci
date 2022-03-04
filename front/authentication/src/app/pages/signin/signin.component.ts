import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { STORAGE_TOKEN_KEY } from 'src/app/injection.tokens';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import {
  IAuthenticationResponse,
  ISuccessfulAuthenticationResponse,
} from '../../models/authentication-responses.model';

import { Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
  static route = 'signin';

  formGroup: FormGroup;
  tokenSubscription!: Subscription;
  error!: string;
  constructor(
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService,
    @Inject(STORAGE_TOKEN_KEY) private storageTokenKey: string
  ) {
    this.formGroup = new FormGroup({
      user: new FormControl('asdf', [
        Validators.required,
        Validators.minLength(5),
      ]),
      password: new FormControl('fdsa', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }
  ngOnDestroy(): void {
    this.tokenSubscription.unsubscribe();
  }

  ngOnInit(): void {}

  openSnackBar(message: string, action: string) {
    // this._snackBar.open(message, action);
  }
  signin() {
    const credentials = this.formGroup.value;
    console.log(credentials);
    this.formGroup.valid;
    if (this.formGroup.status == 'VALID') {
      console.log(credentials);
      const $tokenResponse = this.authenticationService.signin(credentials);
      this.tokenSubscription = $tokenResponse.subscribe(
        (tokenResponse: IAuthenticationResponse) => {
          const token = (tokenResponse as ISuccessfulAuthenticationResponse)
            .token;
          if (token) {
            this.localStorageService.setItem(this.storageTokenKey, token);
            //TODO: Move this to a adgeci core library
            window.dispatchEvent(
              new CustomEvent('USER-AUTHENTICATED', {
                detail: { token },
              })
            );
          }
        },
        (err) => {},
        () => {}
      );
    } else {
      this.error =
        'Revise las credenciales. El usuario debe tener mínimo 5 caracteres y la contraseña 8.';
    }
  }
}
