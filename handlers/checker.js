import { db } from "../lib/mongo.js";
import jwt from "jsonwebtoken";

export async function checker(req, res, next) {
  const Users = db.collection("users");

  const { auth } = req.cookies;

  const { _id } = jwt.verify(auth, process.env.SECRET, {
    issuer: process.env.DOMAIN
  });

  const user = await Users.findOne({ _id });

  if (user == null) return res.status(401).json({ error: "Unauthorized" });

  req.user = user;

  next();
}
