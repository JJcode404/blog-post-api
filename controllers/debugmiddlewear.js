const debugMiddleware = (req, res, next) => {
  console.log("🔍 DEBUG: Request received for path:", req.originalUrl);

  // Add a callback for when the response is finished
  res.on("finish", () => {
    console.log("🔍 DEBUG: Response finished with status:", res.statusCode);
  });

  // Wrap the next middleware in a try-catch to capture errors
  try {
    next();
  } catch (error) {
    console.error("🔍 DEBUG: Error caught in debug middleware:", error);
    throw error; // Rethrow to continue normal error handling
  }
};

// And add this specific middleware to intercept file uploads
const fileUploadDebugMiddleware = (req, res, next) => {
  const originalUpload = req.file;

  // Create a proxy for req.file
  Object.defineProperty(req, "file", {
    get: function () {
      console.log(
        "🔍 DEBUG: req.file accessed",
        originalUpload
          ? `(file: ${originalUpload.originalname}, path: ${originalUpload.path})`
          : "(no file)"
      );
      return originalUpload;
    },
    set: function (value) {
      console.log("🔍 DEBUG: req.file set to", value);
      originalUpload = value;
    },
    configurable: true,
  });

  next();
};
export { debugMiddleware, fileUploadDebugMiddleware };
