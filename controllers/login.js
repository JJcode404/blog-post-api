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
    const { password, ...safeUser } = user;

    const token = jwt.sign(safeUser, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    console.log("JWT:", token);
    res.json({
      Token: token,
      user: safeUser,
    });
  })(req, res, next);
};

export { authenticateUser };
