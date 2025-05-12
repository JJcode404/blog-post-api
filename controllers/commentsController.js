import { prisma } from "../prismaClient.js";
import { AppError } from "../utils/AppError.js";

const createComment = async (req, res, next) => {
  try {
    const { content, userId, username, email } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        username,
        email,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const createPostComment = async (req, res, next) => {
  try {
    const { postid } = req.params;
    const { content, userId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postid } },
        user: { connect: { id: userId } },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (!comments.length) {
      return next(new AppError("No comments found", 404));
    }

    res.json(comments);
  } catch (error) {
    next(new AppError("Something went wrong while fetching comments", 500));
  }
};
const getCommentsByUserId = async (req, res, next) => {
  const { authorId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    // Count total comments for pagination metadata
    const totalCount = await prisma.comment.count({
      where: {
        userId: authorId,
      },
    });

    const userComments = await prisma.comment.findMany({
      where: {
        userId: authorId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        post: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    if (!userComments.length) {
      return next(new AppError("No comments found for this user", 404));
    }

    res.json({
      comments: userComments.map((comment) => ({
        content: comment.content,
        createdAt: comment.createdAt,
        id: comment.id,
        authorName: comment.user.name,
        postTitle: comment.post.title,
      })),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    next(
      new AppError(
        "Something went wrong while retrieving comments by user ID",
        500
      )
    );
  }
};

const getPostAllComments = async (req, res, next) => {
  try {
    const { postid } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId: postid },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    // if (!comments.length) {
    //   return next(new AppError("No comments found for this post", 404));
    // }

    res.json(comments);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const getComment = async (req, res, next) => {
  try {
    const { commentid } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentid },
    });

    if (!comment) {
      return next(new AppError("No comment found", 404));
    }

    res.json(comment);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { commentid } = req.params;
    const { content } = req.body;

    const updatedComment = await prisma.comment.update({
      where: { id: commentid },
      data: { content },
    });

    res.json(updatedComment);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentid } = req.params;

    const commentDeleted = await prisma.comment.delete({
      where: { id: commentid },
    });

    res.json(commentDeleted);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export {
  createComment,
  updateComment,
  createPostComment,
  getPostAllComments,
  getCommentsByUserId,
  getAllComments,
  getComment,
  deleteComment,
};
