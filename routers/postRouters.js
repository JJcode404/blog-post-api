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

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const postRouter = Router();

postRouter.post("/", upload.single("thumbnail"), createPost);
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
