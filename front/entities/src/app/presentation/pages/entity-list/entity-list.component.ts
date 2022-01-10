import { Component, OnInit } from '@angular/core';
import { IActionModel, IDefinitionModel } from 'crud-builder';
import { of } from 'rxjs';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
})
export class EntityListComponent implements OnInit {
  /**
   * Lets you to define the schema definition for the collection. That means that the structure of the collection.
   *
   * @type {IDefinitionModel}
   * @memberof AppComponent
   */
  schemaDefinition: IDefinitionModel = {
    columns: [
      {
        definition: 'name',
        tag: 'Nombre',
      },
    ],
    definitions: ['name'],
    tags: ['Nombre'],
    schema: {
      _id: {
        $oid: '5e38569701c17a0da5e1c5ec',
      },
      collection: 'tutors',
      type: 'entity',
      presentation: {
        icon: 'supervisor_account',
      },
      display: 'Usuarios',
      repr: ['name'],
    },
  };

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
      }
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
      event: (item: any) => {
        console.log('Imprime algo', item);
        return Promise.resolve(item);
      },
      openDetail: true,
    },
    {
      display: 'Eliminar',
      icon: 'clear',
      event:
        'function eva (item)  {console.log("Imprime algo",item);} eva(item);',
      openDetail: false,
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
    console.log(page, sizePage, definition, 1);
    return of([
      {
        name: 'Sergio',
      },
    ]);
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
      openDetail: false,
    },
    {
      display: 'Descargar Historial',
      event: (items) => {
        console.log('D=> ', items);
        return Promise.resolve(items);
      },
      openDetail: false,
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
