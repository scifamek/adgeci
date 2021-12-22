import { EntityEnterpriseRepository } from "../../../core/repository/enterprise/entity/entity-repository";
import { EntityModel } from "./entity.model";
export interface Param {
  enterpriseId: string;
  collection: string;
  entity: EntityModel;
}
export class CreateEntityUsecase {
  constructor(private entitiesRepository: EntityEnterpriseRepository) {}
  async call(data: Param) {
    const response = await this.entitiesRepository.createEntityByType(
      data.collection,
      data.entity
    );
    return response;
  }
}
