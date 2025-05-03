import { Router } from "express";
import {
  createPost,
  getAllposts,
  getPost,
  updatePost,
  deletePost,
  getLatestPost,
} from "../controllers/postsController.js";
import {
  getPostAllComments,
  createPostComment,
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import { verifyToken } from "../controllers/verifyJwt.js";
const postRouter = Router();

postRouter.post("/", verifyToken, createPost);
postRouter.get("/", getAllposts);
postRouter.get("/latest", getLatestPost);
postRouter.get("/:postid", getPost);
postRouter.put("/:postid", verifyToken, updatePost);
postRouter.delete("/:postid", verifyToken, deletePost);

//comments routes
postRouter.post("/:postid/comments", verifyToken, createPostComment);
postRouter.get("/:postid/comments", getPostAllComments);
postRouter.get("/:postid/comments/:commentid", getComment);
postRouter.put("/:postid/comments/:commentid", verifyToken, updateComment);
postRouter.delete("/:postid/comments/:commentid", verifyToken, deleteComment);

export { postRouter };
