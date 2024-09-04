const express = require("express");
const router = express.Router();
const controllerUser = require("../../controllers/users");
const authenticator = require("../../auth/auth");

router.post("/signup", controllerUser.signUp);

router.post("/login", controllerUser.logIn);

router.get("/logout", authenticator.auth, controllerUser.logOut);

router.get("/current", authenticator.auth, controllerUser.getCurrent);

module.exports = router;
