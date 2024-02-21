const User = require("./model");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(201).json({ message: "user added", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "all users", users: users });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

const login = async (req, res) => {
  try {
    // https://www.npmjs.com/package/jsonwebtoken

    const token = await jwt.sign({ id: req.user.id }, process.env.SECRET);

    console.log(token);

    const user = {
      id: req.user.id,
      username: req.user.username,
      token: token,
    };

    res.status(201).json({ message: "login success", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

const getOneUser = async (req, res) => {
  res.status(201).json({ message: "login success", user: req.user });
};

module.exports = {
  signupUser: signupUser,
  getAllUsers: getAllUsers,
  login: login,
  getOneUser: getOneUser,
};
