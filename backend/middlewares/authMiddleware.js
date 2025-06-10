import jwt from "jsonwebtoken"; //import jwt in ES Modules

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "No token provided 🔒",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authentication Failed 🥲",
        });
      } else {
        req.body.userId = decoded.userId;
        next();
      }
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).send({
      success: false,
      error,
      message: "Authentication Failed",
    });
  }
};

export default authMiddleware; // ES Module style
