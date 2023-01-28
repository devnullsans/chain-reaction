import { OAuth2Client } from "google-auth-library";
import { db } from "../lib/mongo.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLECLIENTID);

export async function logout(_, res) {
  res.clearCookie("auth", {
    secure: true,
    httpOnly: true,
    sameSite: true
  });

  res.status(200).json({ data: "Farewell" });
}
