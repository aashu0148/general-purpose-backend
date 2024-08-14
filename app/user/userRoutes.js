import express from "express";

import {
  getCurrentUser,
  loginUser,
  signupUser,
  updateUser,
} from "./userServices.js";
import { authenticateUserMiddleware } from "./userMiddleware.js";

const rootRouter = express.Router();
const router = express.Router();

router.get("/me", authenticateUserMiddleware, getCurrentUser);
router.patch("/", authenticateUserMiddleware, updateUser);
router.post("/login", loginUser);
router.post("/signup", signupUser);

rootRouter.use("/users", router);

export default rootRouter;
