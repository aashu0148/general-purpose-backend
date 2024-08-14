import express from "express";

import {
  createForm,
  getForm,
  updateForm,
  deleteForm,
  getUserForms,
} from "./formServices.js";
import { authenticateUserMiddleware } from "../user/userMiddleware.js";

const rootRouter = express.Router();
const router = express.Router();

router.get("/", authenticateUserMiddleware, getUserForms);
router.post("/", authenticateUserMiddleware, createForm);
router.get("/:id", authenticateUserMiddleware, getForm);
router.patch("/:id", authenticateUserMiddleware, updateForm);
router.delete("/:id", authenticateUserMiddleware, deleteForm);

rootRouter.use("/forms", router);

export default rootRouter;
