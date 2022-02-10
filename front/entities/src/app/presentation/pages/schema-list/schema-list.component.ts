import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/models/response.model';
import { SchemaModel } from 'src/app/models/schema.model';
import { SchemaService } from 'src/app/services/schema/schema.service';
import { EntityListComponent } from '../entity-list/entity-list.component';

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss'],
})
export class SchemaListComponent implements OnInit {
  $schemas: Observable<ResponseModel<SchemaModel[]>>;

  constructor(private schemaService: SchemaService, private router: Router) {
    this.$schemas = this.schemaService.getSchemasTypeEntity();
    this.$schemas.subscribe(console.log);
  }

  goToListItems(schema: any) {
    this.router.navigate([EntityListComponent.route], {
      queryParams: {
        schema: JSON.stringify(schema),
      },


    });
  }

  ngOnInit(): void {}
}
