import { body, validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

const signupValidationErrors = {
  fullnameErr: "must be between 3 and 50 characters.",
  emailErr: "must be a valid email address.",
  passwordErr: "must be at least 6 characters long.",
};

const validateSignup = [
  body("fullname")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage(`Fullname ${signupValidationErrors.fullnameErr}`)
    .custom((value) => {
      const words = value.split(" ").filter(Boolean);
      if (words.length < 2) {
        throw new Error("Fullname must contain at least first and last name.");
      }
      return true;
    }),

  body("email")
    .trim()
    .isEmail()
    .withMessage(`Email ${signupValidationErrors.emailErr}`),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage(`Password ${signupValidationErrors.passwordErr}`),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      console.log(firstError);

      return next(new AppError(firstError.msg, 400));
    }

    next();
  },
];

export { validateSignup };
