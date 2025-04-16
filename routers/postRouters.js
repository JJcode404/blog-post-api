import { Router } from "express";
import {
  createPost,
  getAllposts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postsController.js";
const postRouter = Router();

postRouter.post("/", createPost);
postRouter.get("/", getAllposts);
postRouter.get("/:postid", getPost);
postRouter.put("/:postid", updatePost);
postRouter.delete("/:postid", deletePost);

export { postRouter };
