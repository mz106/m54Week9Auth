const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../users/model");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const hashPass = async (req, res, next) => {
  try {
    console.log("req.body.password before hash: ", req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); // a hashed password

    req.body.password = hashedPassword; // swap the value 'helloworld' in req.body.password to the value of hashedPassword
    console.log("req.body.password after hash: ", req.body.password);
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const comparePass = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    const matched = await bcrypt.compare(
      req.body.password,
      user.dataValues.password
    );

    if (!matched) {
      res.status(401).json({ message: "no!!!!!!!!!!!" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const tokenCheck = async (req, res, next) => {
  try {
    console.log(req.header("Authorization"));
    // 1. check request headers - does Authorization exist

    if (!req.header("Authorization")) {
      throw new Error("No token passed");
    }

    // 2. get the JWT from the headers

    const token = req.header("Authorization").replace("Bearer ", "");

    // 3. decode the token using SECRET

    const decodedToken = await jwt.verify(token, process.env.SECRET);

    // 4. get user with id

    const user = await User.findOne({ where: { id: decodedToken.id } });

    // 5. if !user send 401 response

    if (!user) {
      res.status(401).json({ message: "not authorized" });
      return;
    }

    // 6. pass on user data to login function

    req.authCheck = user;

    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
  tokenCheck: tokenCheck,
};
