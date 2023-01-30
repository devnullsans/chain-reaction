import cookieParser from "cookie-parser";
import { Router, json } from "express";
import { login } from "./handlers/login.js";
import { isAuth } from "./handlers/isAuth.js";
import { stats } from "./handlers/stats.js";
import { logout } from "./handlers/logout.js";

const router = Router();

router.use([cookieParser(), json()]);

router.post("/login", login);

router.get("/logout", isAuth, logout);

router.get("/stats", isAuth, stats);

router.get("/create", isAuth);

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
