import { Router } from "express";
import { getCommentsByUserId } from "../controllers/commentsController.js";
import { getPostsByuserId } from "../controllers/postsController.js";

const authorRouter = Router();
authorRouter.get("/comments/:userid", getCommentsByUserId);
authorRouter.get("/posts/:userid", getPostsByuserId);

export { authorRouter };
