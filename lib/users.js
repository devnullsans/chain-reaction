import jwt from "jsonwebtoken";
import { db } from "./mongo.js";

export async function findUser(token) {
  const { _id } = jwt.verify(token, process.env.SECRET, {
    issuer: process.env.DOMAIN
  });

  const Users = db.collection("users");
  const user = await Users.findOne(
    { _id, banned: false },
    { projection: { name: 1, picture: 1 } }
  );

  return user;
}
