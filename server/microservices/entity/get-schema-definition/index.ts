import { BaseController } from "../../../core/access/base-controller";
import { ResponseModel } from "../../../core/domain/models/response.model";
import { buildResponseCode } from "../../../core/helpers/response-codes.helpers";
import { MongoDBDatasource } from "../../../core/repository/datasource/mongodb.datasource";
import { EntityEnterpriseRepository } from "../../../core/repository/enterprise/entity/entity-repository";
import { SchemaEnterpriseRepository } from "../../../core/repository/enterprise/schemas/schema-repository";
import { SchemaMapper } from "../../../core/repository/enterprise/schemas/schema.mapper";
import { EnterpriseMasterRepository } from "../../../core/repository/master/enterprise/enterprise.master.repository";
import { BASE_CODE, RESPONSE_CODES_MAPPER } from "../response.constants";
import {
  GetSchemaDefinitionUsecase,
  Param,
} from "./get-schema-definition.usecase";

let masterDatabaseConnection = null;
let enterpriseDatabaseConnection = null;
/**
 * This function is encharged of creating a new entity in a specified collection.
 */
export class EntityController extends BaseController<any> {
  async handler(body: any, context: any, callback: any) {
    const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
    const CLUSTER_URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];
    const dataSource = new MongoDBDatasource();
    masterDatabaseConnection = await dataSource.getConnection(
      CLUSTER_URI,
      MASTER_DATABASE_NAME,
      masterDatabaseConnection
    );
    const enterpriseMasterRepository = new EnterpriseMasterRepository(
      masterDatabaseConnection
    );
    const enterpriseObj = await enterpriseMasterRepository.getEnterpriseById(
      body["enterpriseId"]
    );
    if (enterpriseObj && enterpriseObj.database_name) {
      enterpriseDatabaseConnection = await dataSource.getConnection(
        CLUSTER_URI,
        enterpriseObj.database_name,
        enterpriseDatabaseConnection
      );
    }
    const schemaMapper = new SchemaMapper();
    const schemaEnterpriseRepository = new SchemaEnterpriseRepository(
      enterpriseDatabaseConnection,
      schemaMapper
    );

    const usecase = new GetSchemaDefinitionUsecase(schemaEnterpriseRepository);

    const response = await usecase.call(body as Param);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: buildResponseCode(
          BASE_CODE,
          RESPONSE_CODES_MAPPER.SCHEMA_TYPE_ENTITY_SUCCESSFULLY_FOUNDED,
          { ...body, ...enterpriseObj }
        ),
        data: {
          ...response,
        },
      } as ResponseModel<any>),
    };
  }
}

const entityController = new EntityController();
export const handler = entityController.handler;
