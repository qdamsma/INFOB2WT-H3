function authMiddleware(req, res, next) {
  console.log("Session check:", req.session);
    if (req.session.userId) {
      next();
    } else {
      res.redirect("/group19/login");
    }
}

module.exports = authMiddleware;