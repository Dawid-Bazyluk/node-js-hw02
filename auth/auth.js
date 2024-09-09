const passport = require("passport");
const User = require("../schemas/users.schema");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
        data: "Unauthorized",
      });
    }

    const userFromDb = await User.findById(user._id);
    if (
      !userFromDb ||
      userFromDb.token !== req.headers.authorization.split(" ")[1]
    ) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
        data: "Unauthorized",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { auth };
