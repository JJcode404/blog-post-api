import passport from "passport";
import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      return res.json({
        error: `${info.message}`,
      });
    }
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("JWT:", token);
    res.json({
      Token: token,
      user: user,
    });
  })(req, res, next);
};

export { authenticateUser };
