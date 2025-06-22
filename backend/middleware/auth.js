const jwt = require("jsonwebtoken");
const User = require("../../backend/models/user");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    console.log("Auth Middleware: No token provided."); // More specific log
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  try {
    // --- DEBUGGING LOG FOR JWT_SECRET AT VERIFICATION ---
    console.log(
      "DEBUG: Auth Middleware (Verify) - JWT_SECRET is:",
      process.env.JWT_SECRET
    );
    // --- END DEBUGGING LOG ---

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      "Auth Middleware: Token Verified. Decoded User ID:",
      decoded.user.id
    );

    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) {
      console.log(
        "Auth Middleware: User not found for decoded token ID:",
        decoded.user.id
      );
      return res.status(401).json({ msg: "Token is invalid, user not found." });
    }

    req.user = {
      id: user.id,
      isAdmin: user.isAdmin,
    };
    console.log("Auth Middleware: User is admin?", req.user.isAdmin);
    next();
  } catch (err) {
    console.error("Auth middleware error during verification:", err.message);
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ msg: "Token has expired. Please log in again." });
    }
    // This is typically where 'JsonWebTokenError: invalid signature' occurs
    res.status(401).json({ msg: "Token is not valid." });
  }
};
