import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-schema-detail',
  templateUrl: './schema-detail.component.html',
  styleUrls: ['./schema-detail.component.scss'],
})
export class SchemaDetailComponent implements OnInit {
  static route = 'schema-detail';
  schema: any;
  schemaStr: any;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async (params: Params) => {
      this.schemaStr = JSON.stringify(JSON.parse(params.schema), null, 4);
      this.schema = JSON.parse(params.schema);
    });
  }
}
