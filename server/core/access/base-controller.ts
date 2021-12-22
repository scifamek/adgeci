import { ResponseModel } from "../domain/models/response.model";
export class BaseController<T> {
  constructor() {}
  async handler(event: any, context: any, usecase: any) {
    const response = await usecase(event, context);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: {
          status: 156,
          message: "",
        },
        data: response,
      } as ResponseModel<T>),
    };
  }
}
export function baseContoller(event: any, context: any, callback: any) {
  // const masterDataSource = await connectToDatabase(
  //     atlas_connection_uri,
  //     MASTER_DATABASE_NAME,
  //     cachedDb
  //   );
  //   var body = JSON.parse(JSON.stringify(event));
  //   if (event.body !== null && event.body !== undefined) {
  //     body = JSON.parse(event.body);
  //   }
  //   const enterpriseObj = await $insideEnterpriseRepository.getEnterpriseById(
  //     body["enterprise_id"],masterDataSource);
  //    const enterpriseDataSource = await connectToDatabase(
  //     atlas_connection_uri,
  //     enterpriseObj.database_name,
  //     enterpriseDB
  //   );
  //   const enviroment = {
  //     masterDataSource: masterDataSource,
  //     enterpriseDataSource:enterpriseDataSource
  //   }
  //   const response = await callback(repositories,enviroment,body);
  //   return { statusCode: 200, headers: {'Content-Type':'application/json'},body: JSON.stringify(response) };
}
