import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/models/response.model';
import { SchemaModel } from 'src/app/models/schema.model';
import { SchemaService } from 'src/app/services/schema/schema.service';

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss'],
})
export class SchemaListComponent implements OnInit {
  $schemas: Observable<ResponseModel<SchemaModel[]>>;

  constructor(private schemaService: SchemaService) {
    this.$schemas = this.schemaService.getSchemasTypeEntity();
  }

  goToListItems(schemaId: string) {
    console.log(schemaId);
  }

  ngOnInit(): void {}
}
