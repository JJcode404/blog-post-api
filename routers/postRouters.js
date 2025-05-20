import { Router } from "express";
import {
  createPost,
  getAllposts,
  getPost,
  updatePost,
  deletePost,
  getLatestPost,
  updatePublishState,
} from "../controllers/postsController.js";
import {
  getPostAllComments,
  createPostComment,
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import { verifyToken } from "../controllers/verifyJwt.js";
import multer from "multer";
import { validatePost } from "../validators/validateNewpost.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const postRouter = Router();

postRouter.post("/", upload.single("thumbnail"), createPost);
postRouter.get("/", getAllposts);
postRouter.get("/latest", getLatestPost);
postRouter.get("/:postid", getPost);
postRouter.put("/:postid", verifyToken, updatePost);
postRouter.delete("/:postid", deletePost);

//comments routes
postRouter.post("/:postid/comments", verifyToken, createPostComment);
postRouter.get("/:postid/comments", getPostAllComments);
postRouter.get("/:postid/comments/:commentid", getComment);
postRouter.put("/:postid/comments/:commentid", verifyToken, updateComment);
postRouter.delete("/:postid/comments/:commentid", verifyToken, deleteComment);
//update pushlish state
postRouter.put("/:postid/publish", updatePublishState);

export { postRouter };
