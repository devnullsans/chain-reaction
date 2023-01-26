import { MongoClient } from "mongodb";

export let db = null;

export async function Connect() {
  const client = new MongoClient(process.env.MONGOURI ?? "mongodb://localhost:27017");
  await client.connect();
  db = client.db(process.env.MONGODBNAME ?? "chainreaction");
}
