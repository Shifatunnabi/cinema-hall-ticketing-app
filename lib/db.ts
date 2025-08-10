import { MongoClient, Db, type Document } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = (process.env.MONGODB_DB ||
  process.env.MONGODB_DATABASE) as string;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment variables");
}
if (!dbName) {
  throw new Error(
    "Missing MONGODB_DB (or MONGODB_DATABASE) in environment variables"
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalForMongo = global as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise =
    globalForMongo._mongoClientPromise ?? new MongoClient(uri).connect();
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(dbName);
}

export async function getCollection<T extends Document = Document>(
  name: string
) {
  const db = await getDb();
  return db.collection<T>(name);
}
