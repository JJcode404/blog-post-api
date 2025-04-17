import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  createUserProfile,
} from "../controllers/userProfileController.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:userid", getUser);
userRouter.put("/:userid", updateUser);
userRouter.delete("/:userid", deleteUser);

//profile routes

userRouter.post("/:userid/profile", createUserProfile);
userRouter.get("/:userid/profile", getUserProfile);
userRouter.put("/:userid/profile", updateUserProfile);
userRouter.delete("/:userid/profile", deleteUserProfile);

export { userRouter };
