const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  // creating a new user using User model
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  // to store any saved user in databse or server
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // When we use await, we should use try catch statement is there is an any error

  try {
    const user = await User.findOne({
      userName: req.body.user_name,
    });

    // if user is not found display error
    !user && res.status(401).json("Wrong User Name");

    // Decrypting the encrypted password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    // now turn hashed password into an String
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    const inputPassword = req.body.password;
    // if password is not correct display error
    OriginalPassword !== inputPassword &&
      res.status(401).json("Wrong Credentials");

    // After login if everything is correct, we will create a token
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    // Since password is reveling in plain text, it is not
    const { password, ...others } = user._doc;

    // if everthing is OKAY, send the user back
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
