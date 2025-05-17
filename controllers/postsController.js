import { prisma } from "../prismaClient.js";
import { AppError } from "../utils/AppError.js";
import { cloudinary } from "../cloudinary.js";
import fs from "fs";
import path from "path";

const createPost = async (req, res, next) => {
  let localPath;
  // console.log("typeof tags:", typeof req.body.tags);

  try {
    const { title, content, tags, authorId, published } = req.body;

    let imageUrl = "";

    // Handle thumbnail upload
    if (req.file) {
      localPath = req.file.path;

      // 1. Upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(localPath, {
          folder: "myapp_files",
          timeout: 60000,
        });
        console.log("☁️ Cloudinary URL:", result.secure_url);
        imageUrl = result.secure_url;
        fs.unlinkSync(localPath);
      } catch (uploadError) {
        fs.unlinkSync(localPath);
        console.log(uploadError);
        return next(
          new AppError(
            "Image upload failed. Please check your internet connection or try again later.",
            503
          )
        );
      }
    }
    const parsedTags = JSON.parse(tags);

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        thumbnail: imageUrl,
        published: published === "true",
        author: {
          connect: { id: authorId },
        },
        tags: {
          connectOrCreate: parsedTags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    res.status(201).json({
      id: newPost.id,
      title: newPost.title,
      published: newPost.published,
    });
  } catch (error) {
    if (localPath && fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    next(new AppError("Error creating post", 500));
  }
};

const getAllposts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
        comments: true,
        tags: true,
      },
    });

    res.json(posts);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
const getLatestPost = async (req, res, next) => {
  try {
    const first3latestPost = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
      take: 3,
    });
    res.json(first3latestPost);
  } catch (error) {
    next(new AppError(error.message), 500);
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
        tags: true,
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
const getPostsByuserId = async (req, res, next) => {
  try {
    const { userid } = req.params;
    console.log(req.user.id == userid);
    console.log("user id from database", req.user.id);
    console.log("user id from params", userid);

    if (req.user.id !== userid) {
      return res.status(403).json({
        message: "Access denied: You can only access your own comments.",
      });
    }

    const post = await prisma.post.findMany({
      where: { authorId: userid },
      select: {
        title: true,
        published: true,
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(post);
  } catch (error) {
    console.log(error);
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
const updatePublishState = async (req, res, next) => {
  try {
    const { postid } = req.params;
    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({ message: "Invalid 'published' value" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postid },
      data: { published },
    });

    res.json(updatedPost);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postid } = req.params;

    await prisma.comment.deleteMany({
      where: { postId: postid },
    });

    const deletePost = await prisma.post.delete({
      where: { id: postid },
    });

    res.json(deletePost);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export {
  createPost,
  deletePost,
  getAllposts,
  getPost,
  updatePost,
  getLatestPost,
  getPostsByuserId,
  updatePublishState,
};
