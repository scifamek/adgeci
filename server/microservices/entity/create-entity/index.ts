import { BaseController } from "../../../core/access/base-controller";
import { ResponseModel } from "../../../core/domain/models/response.model";
import { buildResponseCode } from "../../../core/helpers/response-codes.helpers";
import { MongoDBDatasource } from "../../../core/repository/datasource/mongodb.datasource";
import { EntityEnterpriseRepository } from "../../../core/repository/enterprise/entity/entity-repository";
import { EnterpriseMasterRepository } from "../../../core/repository/master/enterprise/enterprise.master.repository";
import { method } from "../../../core/helpers/decorators";
import { EntityModel } from "./entity.model";
import { CreateEntityUsecase, Param } from "./create-entity.usecase";
import { BASE_CODE, RESPONSE_CODES_MAPPER } from "../response.constants";
import jwt_decode from "jwt-decode";

let masterDatabaseConnection = null;
let enterpriseDatabaseConnection = null;
/**
 * This function is encharged of creating a new entity in a specified collection.
 */
export class EntityController extends BaseController<EntityModel> {
  @method("post")
  async handler(event: any, context: any, callback: any) {
    const body = event.body || {};
    const headers = event.headers || {};
    console.log(event);
    if (!headers.token) {
      return {
        statusCode: 304,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: {
            status: 304,
            message: "Token is not present in the header",
          },
          data: {},
        } as ResponseModel<any>),
      };
    }

    const decodedToken = jwt_decode(headers.token);

    console.log(decodedToken);

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
      decodedToken["enterpriseId"]
    );
    if (enterpriseObj && enterpriseObj.database_name) {
      enterpriseDatabaseConnection = await dataSource.getConnection(
        CLUSTER_URI,
        enterpriseObj.database_name,
        enterpriseDatabaseConnection
      );
    }

    const entityRepository = new EntityEnterpriseRepository(
      enterpriseDatabaseConnection
    );
    const usecase = new CreateEntityUsecase(entityRepository);
    const response = await usecase.call(body as Param);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: buildResponseCode(
          BASE_CODE,
          RESPONSE_CODES_MAPPER.ENTITY_SUCCESSFULLY_STORED,
          body
        ),
        data: {
          id: response.insertedId,
          ...body.entity,
        },
      } as ResponseModel<EntityModel>),
    };
  }
}

const entityController = new EntityController();
export const handler = entityController.handler;
