import { db } from "./mongo.js";
import jwt from "jsonwebtoken";

export async function findUser(token) {
  const { _id } = jwt.verify(token, process.env.SECRET, {
    issuer: process.env.DOMAIN
  });

  const Users = db.collection("users");
  const user = await Users.findOne({ _id });

  if (user == null) throw new Error("Unauthorized");
  return user;
}
