import { prisma } from "../prismaClient.js";
import { AppError } from "../utils/AppError.js";

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    const user = await prisma.user.create({
      data: { name, email, password },
    });

    res.status(201).json({
      message: "User succefully created",
      user,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true, posts: true, comments: true },
    });

    res.json(users);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userid },
      include: { profile: true, posts: true, comments: true },
    });

    if (!user) {
      next(new AppError("User Not Found", 400));
    }

    res.json(user);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const { name, email, password, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userid },
      data: { name, email, password, role },
    });

    res.json(updatedUser);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    await prisma.user.delete({
      where: { id: userid },
    });

    res.status(204).send();
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export { createUser, deleteUser, updateUser, getUser, getAllUsers };
