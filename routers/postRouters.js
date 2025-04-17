import { Router } from "express";
import {
  createPost,
  getAllposts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postsController.js";
import {
  getPostAllComments,
  createPostComment,
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
const postRouter = Router();

postRouter.post("/", createPost);
postRouter.get("/", getAllposts);
postRouter.get("/:postid", getPost);
postRouter.put("/:postid", updatePost);
postRouter.delete("/:postid", deletePost);

//comments routes
postRouter.post("/:postid/comments", createPostComment);
postRouter.get("/:postid/comments", getPostAllComments);
postRouter.get("/:postid/comments/:commentid", getComment);
postRouter.put("/:postid/comments/:commentid", updateComment);
postRouter.delete("/:postid/comments/:commentid", deleteComment);

export { postRouter };
