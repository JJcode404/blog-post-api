import { prisma } from "../prismaClient.js";
import { AppError } from "../utils/AppError.js";

const createPost = async (req, res, next) => {
  try {
    const { title, content, thumbnail, published, authorId } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnail,
        published,
        author: { connect: { id: authorId } },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const getAllposts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
    });

    res.json(posts);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get a specific post by ID
const getPost = async (req, res, next) => {
  try {
    const { postid } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: postid },
      include: {
        author: true,
        comments: true,
      },
    });

    if (!post) {
      return next(new AppError("Post not found.", 404));
    }

    res.json(post);
  } catch (error) {
    next(new AppError(error.message), 500);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { postid } = req.params;
    const { title, content, thumbnail, published } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: postid },
      data: {
        title,
        content,
        thumbnail,
        published,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postid } = req.params;

    await prisma.post.delete({
      where: { id: postid },
    });

    res.status(204).send();
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export { createPost, deletePost, getAllposts, getPost, updatePost };
