import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import bcrypt from "bcryptjs";
import { prisma } from "./prismaClient.js";
import { postRouter } from "./routers/postRouters.js";
import { commentRouter } from "./routers/comentsRotuers.js";
import { userRouter } from "./routers/usersRotures.js";
import { loginRouter } from "./routers/loginRouters.js";
import { signupRouter } from "./routers/signupRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "public");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));
app.use(express.json());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email", email });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password", email });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/sign-up", signupRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`BLOG POST API - listening on port ${PORT}!`)
);
