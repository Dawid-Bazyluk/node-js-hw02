const express = require("express");
const router = express.Router();
const controllerUser = require("../../controllers/users");
const authenticator = require("../../auth/auth");
const avatarUpload = require("../../middleware/upload");

router.get("/verify/:verificationToken", controllerUser.checkUser);

router.post("/verify", controllerUser.verificationEmail);

router.post("/signup", controllerUser.signUp);

router.post("/login", controllerUser.logIn);

router.get("/logout", authenticator.auth, controllerUser.logOut);

router.get("/current", authenticator.auth, controllerUser.getCurrent);

router.patch(
  "/avatars",
  authenticator.auth,
  avatarUpload,
  controllerUser.updateImageURL
);

module.exports = router;
