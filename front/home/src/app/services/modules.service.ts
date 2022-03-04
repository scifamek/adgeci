import { Inject, Injectable } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { SERVER_HOST } from '../injection.tokens';
import { IModuleModel } from '../models/module.model';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from 'adgeci-core-utils/models';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  constructor(
    private client: HttpClient,
    @Inject(SERVER_HOST) private host: string
  ) {}
  getModulesByEnterprise(): Observable<ResponseModel<IModuleModel[]>> {
    return this.client.get<ResponseModel<IModuleModel[]>>(
      `${this.host}/v1/get-modules-by-enterprise`
    );
  }
}
