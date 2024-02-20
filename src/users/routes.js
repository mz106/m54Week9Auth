const { Router } = require("express");
const userRouter = Router();

const {
  hashPass,
  comparePass,
  emailValidation,
  passwordValdation,
} = require("../middleware/auth");

const { signupUser, getAllUsers, login, getOneUser } = require("./controllers");

userRouter.post(
  "/users/signup",

  hashPass,
  signupUser
);

userRouter.post(
  "/users/login",

  comparePass,
  login
);

userRouter.get("/users/getAllUsers", getAllUsers);

userRouter.get("/users/getOneUser/:username", getOneUser);

userRouter.get("/hello", async (req, res) => {
  //gkhsgdk;fh
});

module.exports = userRouter;
