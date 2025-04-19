import { Router } from "express";
import {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import { verifyToken } from "../controllers/verifyJwt.js";
const commentRouter = Router();

commentRouter.post("/", verifyToken, createComment);
commentRouter.get("/", getAllComments);
commentRouter.get("/:commentid", getComment);
commentRouter.put("/:commentid", verifyToken, updateComment);
commentRouter.delete("/:commentid", verifyToken, deleteComment);

export { commentRouter };
