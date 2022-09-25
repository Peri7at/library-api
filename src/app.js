const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const { connectToMongo } = require("./db/connection");
const authRoutes = require("./routers/auth");
const bookRoutes = require("./routers/book");
const userRoutes = require("./routers/user");
const globalRoutes = require("./routers/global");

const app = express();

const port = process.env.NODE_LOCAL_PORT;

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.get("/status", (req, res) => {
  res.send("The server is up and running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/global", globalRoutes);

const server = app.listen(port, () => {
  console.log("info: ", `Server is running on port ${port}`);
  connectToMongo();
});

module.exports = server;
