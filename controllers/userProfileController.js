import { prisma } from "../prismaClient.js";
import { AppError } from "../utils/AppError.js";

const createUserProfile = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const { bio, avatarUrl } = req.body;

    const profile = await prisma.userProfile.create({
      data: {
        bio,
        avatarUrl,
        user: { connect: { id: userid } },
      },
    });

    res.status(201).json(profile);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { userid } = req.params;

    const profile = await prisma.userProfile.findUnique({
      where: { userId: userid },
    });

    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.json(profile);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const { bio, avatarUrl } = req.body;

    const updatedProfile = await prisma.userProfile.update({
      where: { userId: userid },
      data: { bio, avatarUrl },
    });

    res.json(updatedProfile);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const deleteUserProfile = async (req, res, next) => {
  try {
    const { userid } = req.params;

    await prisma.userProfile.delete({
      where: { userId: userid },
    });

    res.status(204).send();
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export {
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserProfile,
};
