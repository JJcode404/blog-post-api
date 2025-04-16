import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { postRouter } from "./routers/postRouters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "public");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use("/posts", postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`BLOG POST API - listening on port ${PORT}!`)
);
