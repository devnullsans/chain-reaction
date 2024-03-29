import { OAuth2Client } from "google-auth-library";
import { db } from "../lib/mongo.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLECLIENTID);

export async function login(req, res) {
  const Users = db.collection("users");

  const { credential, clientId } = req.body;

  const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });

  const { sub, email, name, picture } = ticket.getPayload();

  let user = await Users.findOne({ _id: sub });

  if (user === null) {
    // [..."L67KTFPDZTPTY"].reduce((r, v) => r * 36n + BigInt(parseInt(v, 36)), 0n)
    user = {
      _id: sub,
      key: BigInt(sub).toString(36),
      emails: [email],
      name,
      picture,
      ads: 0,
      banned: false,
      totals: [0, 0, 0, 0],
      winnings: [0, 0, 0, 0]
    };
    await Users.insertOne(user);
    // TODO send welcome email if needed
  } else {
    // user.name = name;
    // user.picture = picture;
    // if (!user.emails.includes(email)) user.emails.push(email);
    await Users.updateOne(
      { _id: sub },
      { $set: { name, picture }, $addToSet: { emails: email } }
    );
    // TODO check for banned and restrict players
    if (user.banned) return res.status(403).json({ error: "Forbidden ⛔️" });
    // TODO update banned according to ads & totals
    // const isAdsBlocked = user.ads * 2 < user.totals.reduce((t, v) => t + v);
    // if (isAdsBlocked) user.banned = true;
  }

  const { _id, key, emails } = user;
  const token = jwt.sign({ _id, key, emails }, process.env.SECRET, {
    expiresIn: process.env.EXPIRE,
    issuer: process.env.DOMAIN
  });

  res.cookie("auth", token, {
    secure: true,
    maxAge: 864e5,
    httpOnly: true,
    sameSite: true
  });

  res.status(200).json({ data: "Welcome" });
}
