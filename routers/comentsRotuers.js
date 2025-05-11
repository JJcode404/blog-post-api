import { Router } from "express";
import {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
  getCommentsByUserId,
} from "../controllers/commentsController.js";
import { verifyToken } from "../controllers/verifyJwt.js";
const commentRouter = Router();

commentRouter.post("/", verifyToken, createComment);
commentRouter.get("/", getAllComments);
commentRouter.get("/:commentid", getComment);
commentRouter.get("/user/:userid", getCommentsByUserId);
commentRouter.put("/:commentid", verifyToken, updateComment);
commentRouter.delete("/:commentid", verifyToken, deleteComment);

export { commentRouter };
