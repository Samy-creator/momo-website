// This middleware assumes your existing 'auth' middleware has already
// verified the JWT and attached a 'user' object to 'req' (e.g., req.user.id).
// It also assumes req.user now includes an 'isAdmin' property.

module.exports = function (req, res, next) {
  // Check if req.user exists and if the user is an admin
  if (!req.user || req.user.isAdmin !== true) {
    // If not authenticated or not an admin, send a 403 Forbidden response
    return res.status(403).json({ msg: "Authorization denied, not an admin." });
  }
  // If user is an admin, proceed to the next middleware/route handler
  next();
};
