/*  this middleware is called after the user-authentication
 to verify that user is authorized to access some protected user endpoints */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.user.role.toLowerCase() !== "admin") {
          return res
            .status(401)
            .json({ message: "Sorry, you do not have admin permissions" });
        } else {
          next();
        }
      }
    });
  } else {
    // delete the token when it is invalid
    res.clearCookie("token");
    return res.status(401).json({ message: "You are not authenticated" });
  }
};
