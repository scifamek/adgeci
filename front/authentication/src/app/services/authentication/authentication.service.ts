import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IAuthenticationResponse,
  ISuccessfulAuthenticationResponse,
} from 'src/app/models/authentication-responses.model';
import { SERVER_HOST } from '../../injection.tokens';
import { ICredentialsModel } from '../../models/credentials.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(@Inject(SERVER_HOST) host: string) {}

  //TODO: Implement
  signin(credentials: ICredentialsModel): Observable<IAuthenticationResponse> {
    return of({
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjoiMTItMDItMjAyMiIsImVudGVycHJpc2UtaWQiOiJKb2huIERvZSIsImV4cGlyYXRpb24tZGF0ZSI6IjEzLTAyLTIwMjIifQ.jH5HTbuHMr5L32Kjb5MeZh9fl_Ud9cjbImwwsRv3-Vc',
    } as ISuccessfulAuthenticationResponse);
  }

  //TODO: Implement
  verifyToken(JWT: string): Observable<boolean> {
    return of(true);
  }
}
