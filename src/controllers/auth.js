const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const saltRounds = 10;

const User = require("../models/user");

module.exports = {
  signInUser: async (req, res) => {
    const { username, email, password, rememberMe } = req.body;
    let cookieAge = 24 * 3600; // Default cookie expiry time is 1 day
    try {
      const user = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (!user) throw new Error("Wrong username or email");
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) throw new Error("Wrong password");

      const payload = {
        user: {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          _id: user._id,
        },
      };

      if (rememberMe) {
        cookieAge *= 14; // Remember me setting extends cookie expiry time to 2 weeks
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: cookieAge,
        subject: user._id.toString(),
      });

      res.cookie("token", token, {
        maxAge: cookieAge * 1000,
        httpOnly: true,
      });
      res.json({ message: "Successfully signed in" });
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },
  // eslint-disable-next-line consistent-return
  signUpUser: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        passwordConfirm,
        address,
        acceptTerms,
      } = req.body;

      if (await User.exists({ username })) {
        throw new Error("Username already used");
      }
      if (await User.exists({ email })) {
        throw new Error("Email already used");
      }
      if (password !== passwordConfirm) {
        throw new Error("Passwords do not match");
      }

      const passwordHash = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({
        firstName,
        lastName,
        username,
        email,
        password_hash: passwordHash,
        acceptTerms,
        address,
      });
      newUser.password_hash = undefined;
      res.json(newUser);
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },
  signOutUser: (req, res) => {
    try {
      res.clearCookie("token");
      res.json({ success: true });
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },
  updateUser: async (req, res, next) => {
    const { _id } = req.user;
    const { role } = req.body;
    try {
      if (!role || !_id) {
        throw new Error("Please specify role");
      }
      if (role !== "admin") {
        throw new Error("User role is not an admin");
      }

      const user = await User.findById(_id);
      if (user.role === "admin") {
        throw new Error("User is already an admin");
      }
      user.role = role;
      user.save((err) => {
        //Monogodb error checker
        if (err) {
          res
            .status("400")
            .json({ message: "An error occurred", error: err.message });
          process.exit(1);
        }
        res.json({
          message: "Update successful: You need to sign-in again",
          user,
        });
      });
    } catch (err) {
      res.status(422).json({ message: err.message ?? err });
    }
  },
};
