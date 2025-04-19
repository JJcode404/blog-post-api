import { prisma } from "../prismaClient.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
const postUserDetails = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const isEmailOnDatabase = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (!isEmailOnDatabase) {
      const addUserToDb = await prisma.user.create({
        data: {
          name: req.body.fullname,
          email: req.body.email,
          password: hashedPassword,
        },
      });

      res.json({
        message: "User signed up succefully",
        user: addUserToDb,
      });
    } else {
      next(new AppError("Email already in use. Try logging in instead.", 400));
    }
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export { postUserDetails };
