import { Router } from "express";
import {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";

const commentRouter = Router();

commentRouter.post("/", createComment);
commentRouter.get("/", getAllComments);
commentRouter.get("/:commentid", getComment);
commentRouter.put("/:commentid", updateComment);
commentRouter.delete("/:commentid", deleteComment);

export { commentRouter };
