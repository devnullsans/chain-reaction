import { Connect, db } from "./lib/mongo.js";

async function test() {
  const Users = db.collection("users");
  const user = await Users.findOne(
    { _id: "100323445678936936098" },
    { projection: { name: 1, picture: 1 } }
  );
  console.log("user", user);
}

Connect().then(() => test());
