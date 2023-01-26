import { config } from "dotenv";
import cors from "cors";
import express from "express";
import { resolve } from "node:path";
import { Connect } from "./lib/mongo.js";
import api from "./api.js";

config();

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use("/api", api);

app.use([
  express.static(resolve(process.cwd(), "./public")),
  (req, res, next) => (req.method === "GET" ? res.redirect(301, "/") : next())
]);

Connect()
  .then(() =>
    app.listen(process.env.PORT ?? 8080, process.env.HOST ?? "localhost", () =>
      console.log("Server Started")
    )
  )
  .catch(console.error);
