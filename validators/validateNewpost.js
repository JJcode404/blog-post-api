import { body, validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";
import fs from "fs";

// Define validation rules for post creation/updates
const validatePost = [
  // Title validations
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  // Content validations
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  // Author ID validation

  // Tags validation
  body("tags").custom((value) => {
    try {
      const tags = JSON.parse(value);
      if (!Array.isArray(tags)) {
        throw new Error("Tags must be an array");
      }
      if (tags.some((tag) => typeof tag !== "string")) {
        throw new Error("All tags must be strings");
      }
      if (tags.some((tag) => tag.length > 20)) {
        throw new Error("Tags must be 20 characters or less");
      }
      if (tags.length > 4) {
        throw new Error("Tags much be 4 at max");
      }
      return true;
    } catch (error) {
      throw new Error("Invalid tags format: " + error.message);
    }
  }),

  // Published validation
  body("published")
    .isBoolean()
    .withMessage("Published must be a boolean value"),

  // Thumbnail validation (if provided)
  body("thumbnail").custom((value, { req }) => {
    // Skip validation if no file is uploaded
    if (!req.file) return true;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Remove the invalid file
      fs.unlinkSync(req.file.path);
      throw new Error("Only JPG, PNG, GIF, and WebP images are allowed");
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      // Remove the invalid file
      fs.unlinkSync(req.file.path);
      throw new Error("Image size should not exceed 5MB");
    }

    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      console.log(firstError);
      fs.unlinkSync(req.file.path);

      return next(new AppError(firstError.msg, 400));
    }

    next();
  },
];

export { validatePost };
