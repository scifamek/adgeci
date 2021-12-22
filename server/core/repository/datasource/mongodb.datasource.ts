import { MongoClient } from "mongodb";

export class MongoDBDatasource {
  async getConnection(
    databaseClusterUri: string,
    databaseName: string,
    cachedDB: any
  ) {
    let con = null;
    if (cachedDB && cachedDB.serverConfig.isConnected()) {
      console.log("=> using cached database instance");
      con = cachedDB;
    }
    try {
      const mongoClient = new MongoClient(databaseClusterUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const connection = await mongoClient.connect();
      con = connection.db(databaseName);
    } catch (error) {
      console.log("Error connecting to Mongo ", error);
    } finally {
      return con;
    }
  }
}
