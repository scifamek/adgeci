import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IActionModel, IDefinitionModel } from 'crud-builder';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityService } from '../../../services/entity/entity.service';
import { SchemaService } from '../../../services/schema/schema.service';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
})
export class EntityListComponent implements OnInit {
  static route = 'list';

  /**
   * Lets you to define the schema definition for the collection. That means that the structure of the collection.
   *
   * @type {IDefinitionModel}
   * @memberof AppComponent
   */
  schemaDefinition: IDefinitionModel | undefined;

  // = {
  //   columns: [
  //     {
  //       definition: 'name',
  //       tag: 'Nombre',
  //     },
  //   ],
  //   definitions: ['name'],
  //   tags: ['Nombre'],
  //   schema: {
  //     _id: {
  //       $oid: '5e38569701c17a0da5e1c5ec',
  //     },
  //     collection: 'tutors',
  //     type: 'entity',
  //     presentation: {
  //       icon: 'supervisor_account',
  //     },
  //     display: 'Usuarios',
  //     repr: ['name'],
  //   },
  // };

  /**
   * This attribute is used for defining the presentation schema when you want to display
   * the detail of a item.
   *
   * @memberof AppComponent
   */
  presentationDefinition = {
    component: 'crubu-row',
    children: [
      {
        component: 'crubu-col',

        responsive: {
          xs: {
            layout: 12,
            offset: 0,
          },
          md: {
            layout: 4,
          },
          default: {
            layout: 6,
          },
        },
        children: [],
      },
    ],
  };

  /**
   * This parameter lets you specify the action that creates a new item
   * into the collection that you are seeing.
   *
   *
   * @memberof AppComponent
   */
  createAction = {
    display: 'Nuevo',
    event: (obj: any) => {
      console.log('Qué más pues');
      return Promise.resolve('Qué más pues');
    },
    openDetail: true,
  };

  /**
   * This attribute lets you to create the action per item.
   *
   * @type {IActionModel[]}
   * @memberof AppComponent
   */
  rowActions: IActionModel[] = [
    {
      display: 'Editar',
      icon: 'edit',
      event: (item: any, items) => {
        console.log('Imprime algo', item);
        return Promise.resolve(item);
      },
      mode: 'edit',
    },
    {
      display: 'Eliminar',
      icon: 'clear',
      event: (item, items: any[]) => {
        console.log('Imprime algo', item, items);
        let index = items.indexOf(item);
        console.log(index);
        items.splice(index, 1);
        return Promise.resolve(item);
      },
    },
  ];

  /**
   *
   * @param page Page that you are currently looking
   * @param sizePage This is the size of the page, the items per page.
   * @param definition
   * @returns
   */
  dataFunction = (page: number, sizePage: number, definition: any) => {
    return this.entityService
      .getFormattedEntitiesByType(page, sizePage, definition, this.collection)
      .pipe(
        map((x) => {
          return x.data;
        })
      );
  };

  /**
   * These actions are used to perform task for several items
   *
   * @type {IActionModel[]}
   * @memberof AppComponent
   */
  generalActions: IActionModel[] = [
    {
      display: 'Enviar Correos',
      event: (items) => {
        console.log('D=> ', items);
        return Promise.resolve(items);
      },
    },
    {
      display: 'Descargar Historial',
      event: (items) => {
        console.log('D=> ', items);
        return Promise.resolve(items);
      },
    },
  ];
  collection: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private schemaService: SchemaService,
    private entityService: EntityService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async (params: Params) => {
      const schema = JSON.parse(params.schema);
      console.log(schema);
      this.collection = schema.collection;
      const data = await this.schemaService
        .getSchemaDefinition(schema.collection)
        .toPromise();
      console.log(data);
      this.schemaDefinition = { ...data.data, schema: schema };
      console.log(this.schemaDefinition);
    });
  }
}
