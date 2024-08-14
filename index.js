import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import serverRouter from "#src/app/server.js";
import configs from "./utils/configs.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(serverRouter);

app.listen(5000, () => {
  console.log("Backend is up at port 5000");

  mongoose.set("strictQuery", true);
  mongoose
    .connect(configs.MONGO_URI)
    .then(() => {
      console.log("➡️ Established a connection with the database");
    })
    .catch((err) => console.log("Error connecting to database", err));
});
