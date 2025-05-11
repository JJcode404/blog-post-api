import passport from "passport";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

const authenticateUser = (req, res, next) => {
  console.log(req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      next(new AppError(`${info.message}`, 400));
    }
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "20s" });
    console.log("JWT:", token);
    res.json({
      Token: token,
      user: user,
    });
  })(req, res, next);
};

export { authenticateUser };
