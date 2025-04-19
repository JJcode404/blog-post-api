import { Router } from "express";
import { authenticateUser } from "../controllers/login.js";

const loginRouter = Router();

loginRouter.post("/", authenticateUser);

export { loginRouter };
