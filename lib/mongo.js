import { MongoClient } from "mongodb";

export let db;

export async function Connect() {
  const client = new MongoClient(process.env.MONGOURI ?? "mongodb://127.0.0.1:27017");
  await client.connect();
  db = client.db(process.env.MONGODBNAME ?? "chainreaction");
}
