import express from "express";

import userRoutes from "./user/userRoutes.js";
import formRoutes from "./form/formRoutes.js";
import submissionRoutes from "./submission/submissionRoutes.js";

const router = express.Router();

router.get("/hi", (_req, res) => res.send("Hello there buddy!"));

router.use(userRoutes);
router.use(formRoutes);
router.use(submissionRoutes);

export default router;
