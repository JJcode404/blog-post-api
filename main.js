import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { postRouter } from "./routers/postRouters.js";
import { commentRouter } from "./routers/comentsRotuers.js";
import { userRouter } from "./routers/usersRotures.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "public");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));
app.use(express.json());

app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`BLOG POST API - listening on port ${PORT}!`)
);
