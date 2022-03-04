export interface IAuthenticationResponse {}
export interface ISuccessfulAuthenticationResponse extends IAuthenticationResponse {
  token: string;
}
