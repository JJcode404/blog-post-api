import { body, validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  body("tags").custom((value) => {
    try {
      const tags = JSON.parse(value);
      if (!Array.isArray(tags)) throw new Error("Tags must be an array");
      if (tags.length > 4) throw new Error("Tags must be 4 at max");
      if (tags.some((tag) => typeof tag !== "string")) {
        throw new Error("All tags must be strings");
      }
      if (tags.some((tag) => tag.length > 20)) {
        throw new Error("Tags must be 20 characters or less");
      }
      return true;
    } catch (err) {
      throw new Error("Invalid tags format: " + err.message);
    }
  }),

  body("published")
    .notEmpty()
    .withMessage("Published is required")
    .isBoolean()
    .withMessage("Published must be a boolean value"),

  // Thumbnail check if file is present
  (req, res, next) => {
    if (req.file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(req.file.mimetype)) {
        return next(
          new AppError("Only JPG, PNG, GIF, and WebP images are allowed", 400)
        );
      }

      if (req.file.size > maxSize) {
        return next(new AppError("Image size should not exceed 5MB", 400));
      }
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return next(new AppError(firstError.msg, 400));
    }

    next();
  },
];

export { validatePost };
