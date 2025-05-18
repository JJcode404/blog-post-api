import { Router } from "express";
import { postUserDetails } from "../controllers/signup.js";
import { validateSignup } from "../validators/validateSignup.js";

const signupRouter = Router();

signupRouter.post("/", validateSignup, postUserDetails);

export { signupRouter };
