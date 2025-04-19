import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export { verifyToken };
