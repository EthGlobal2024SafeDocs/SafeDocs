import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: {
  wallets?: mongoDB.Collection;
  documents?: mongoDB.Collection;
  schemas?: mongoDB.Collection;
  shared?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING!
  );

  await client.connect();

  const db: mongoDB.Db = client.db("safe_docs");

  const walletsCollection: mongoDB.Collection = db.collection("wallets");
  const documentsCollections: mongoDB.Collection = db.collection("documents");
  const schemaCollections: mongoDB.Collection = db.collection("schemas");
  const sharedCollections: mongoDB.Collection = db.collection("shared");

  collections.wallets = walletsCollection;
  collections.documents = documentsCollections;
  collections.schemas = schemaCollections;
  collections.shared = sharedCollections;

  console.log(`Successfully connected to database: ${db.databaseName}`);
}
