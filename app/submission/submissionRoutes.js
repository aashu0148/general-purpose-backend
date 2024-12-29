import express from "express";
import { createSubmission, getFormSubmissions } from "./submissionServices.js";
import { authenticateUserMiddleware } from "../user/userMiddleware.js";

const rootRouter = express.Router();
const router = express.Router();

router.post("/", createSubmission);
router.get("/form/:formId", authenticateUserMiddleware, getFormSubmissions);

rootRouter.use("/submissions", router);

export default rootRouter;
