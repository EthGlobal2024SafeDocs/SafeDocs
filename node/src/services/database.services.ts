import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: {
  wallets?: mongoDB.Collection;
  documents?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient('mongodb://localhost:27017');

  await client.connect();

  const db: mongoDB.Db = client.db('safe_docs');

  const walletsCollection: mongoDB.Collection = db.collection("wallets");
  const documentsCollections: mongoDB.Collection = db.collection("documents");

  collections.wallets = walletsCollection;
  collections.documents = documentsCollections;

  console.log(
    `Successfully connected to database: ${db.databaseName}`
  );
}
