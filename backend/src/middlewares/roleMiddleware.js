module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        message: "Forbidden: You do not have permission for this action",
      });
    }
    next();
  };
};
