import { InjectionToken } from "@angular/core";

export const SERVER_HOST = new InjectionToken<string>('Token for the server host')
export const STORAGE_TOKEN_KEY = new InjectionToken<string>('Token for the Jwt token')
