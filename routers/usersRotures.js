import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAuthorData,
} from "../controllers/usersController.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  createUserProfile,
} from "../controllers/userProfileController.js";
import { verifyToken } from "../controllers/verifyJwt.js";
import { getPostsByuserId } from "../controllers/postsController.js";

const userRouter = Router();

userRouter.post("/", verifyToken, createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:userid", getUser);
userRouter.get("/comments/:userid", getUser);
userRouter.get("/posts/:userid", getPostsByuserId);
userRouter.put("/:userid", verifyToken, updateUser);
userRouter.delete("/:userid", verifyToken, deleteUser);

//profile routes

userRouter.post("/:userid/profile", verifyToken, createUserProfile);
userRouter.get("/:userid/profile", getUserProfile);
userRouter.put("/:userid/profile", verifyToken, updateUserProfile);
userRouter.delete("/:userid/profile", verifyToken, deleteUserProfile);

export { userRouter };
