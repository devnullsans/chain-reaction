import cookieParser from "cookie-parser";
import { Router, json } from "express";
import { login } from "./handlers/login.js";
import { checker } from "./handlers/checker.js";
import { stats } from "./handlers/stats.js";

const router = Router();

router.use([cookieParser(), json()]);

router.post("/login", login);

router.get("/stats", checker, stats);

// create game route
// find game route
// join game route

router.use("*", (req, res) => {
  console.log("Route Not Found ❌", req.method, req.path);
  res.status(404).json({ error: "Not Found ❌" });
});

router.use((error, req, res, next) => {
  console.log(error, req.method, req.path);
  res.status(500).json({ error: "Something went wrong ❗" });
});

export default router;
