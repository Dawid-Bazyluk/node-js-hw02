const service = require("../service");
const jwt = require("jsonwebtoken");
const User = require("../schemas/users.schema");
const Joi = require("joi");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const sendVerification = require("../utils/mail");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const secret = process.env.SECRET;

const postSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string(),
});


const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  const validationResult = postSchema.validate({ email, password });

  if (validationResult.error) {
    res.status(400).json({
      message: "data are invalid!",
      details: validationResult.error.message,
    });
    return;
  }

  const user = await service.getUser(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }

  const avatarURL = gravatar.url(
    email,
    { s: "250", r: "g", protocol: "https" },
    true
  );

  const verificationToken = uuidv4();

  try {
    const newUser = new User({ email, password, avatarURL, verificationToken });
    await newUser.setPassword(password);

    sendVerification(email, verificationToken);
    await newUser.save();

    res.status(201).json({
      status: "Registration successful",
      code: 201,
      user: { email, subscription: "starter", avatarURL, verificationToken },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const logIn = async (req, res, _) => {
  const { email, password } = req.body;
  const validationResult = postSchema.validate({ email, password });

  if (validationResult.error) {
    res.status(400).json({
      message: "data is invalid!",
      data: validationResult.error.message,
    });
    return;
  }

  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Incorrect email or password",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "24h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });

  user.token = token;
  user.save();
};

const checkUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await service.getUserWithToken(verificationToken);

  if (user) {
    user.verificationToken = "null";
    user.verify = true;

    await user.save();

    return res.json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  }

  return res.json({
    status: "not found",
    code: 404,
    message: "User not found",
  });
};

const logOut = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({
    status: "success",
    code: 200,
    message: "Authorization was successful",
    data: { user: email, subscription },
  });
};

const updateImageURL = async (req, res, next) => {
  const avatar = req.file;
  const { _id } = req.user;

  const storeImage = path.join(process.cwd(), "public", "avatars");
  console.log(storeImage);
  const avatarPath = path.join(storeImage, `${avatar.originalname}`);
  console.log(avatarPath);
  const avatarURL = `/avatars/${avatar.originalname}`;
  console.log(avatarURL);

  try {
    const avatarResize = await Jimp.read(avatar.path);
    avatarResize.resize(250, 250);

    await avatarResize.writeAsync(avatarPath);

    await fs.promises.unlink(avatar.path);
  } catch (err) {
    await fs.promises.unlink(avatar.path);
    return next(err);
  }

  try {
    const result = await service.updateAvatar(avatarURL, _id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        message: "Updated Avatar",
        data: { avatarURL },
      });
    }
  } catch (err) {
    console.log(err.message);

    next(err);
  }
};

const verificationEmail = async (req, res, next) => {
  const { email } = req.body;

  const validationResult = postSchema.validate({ email });

  if (validationResult.error) {
    return res.status(400).json({
      message: "missing required field email",
      details: validationResult.error.message,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user.verificationToken === "null") {
      return res.status(400).json({
        status: "Bad request",
        code: 400,
        message: "Verification has already been passed",
      });
    }

    sendVerification(user.email, user.verificationToken);

    return res.status(200).json({
      status: "Success",
      code: 200,
      message: "Verification email sent",
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports = {
  getCurrent,
  logIn,
  logOut,
  signUp,
  updateImageURL,
  verificationEmail,
  checkUser
};
