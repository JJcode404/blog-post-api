import { Router } from "express";
import { postUserDetails } from "../controllers/signup.js";

const signupRouter = Router();

signupRouter.post("/", postUserDetails);

export { signupRouter };
