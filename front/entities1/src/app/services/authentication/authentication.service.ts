import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_HOST } from 'src/app/injection.tokens';
import { SchemaModel } from 'src/app/models/schema.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseModel } from 'adgeci-core-utils/models';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private client: HttpClient,
    @Inject(SERVER_HOST) private host: string
  ) {}

  getFormattedEntitiesByType(page: number, sizePage: number, definition: any, collection: any): Observable<ResponseModel<SchemaModel[]>> {
    return this.client.get<ResponseModel<SchemaModel[]>>(
      `${this.host}/v1/entity`
    );
  }
}
