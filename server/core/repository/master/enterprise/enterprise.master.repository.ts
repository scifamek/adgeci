
import { ObjectId } from "mongodb";

export class EnterpriseMasterRepository{

  constructor(private masterDataSource: any ){
  }

    async getEnterpriseById (enterpriseId: string) {
      const enterpriseObj = await this.masterDataSource
      .collection("enterprises")
      .find({
        _id: ObjectId(enterpriseId),
      })
      .toArray();
      return enterpriseObj[0];
    }
}
