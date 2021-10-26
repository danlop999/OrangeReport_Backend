const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const router = express.Router();

router.use("/article", require("./article.js"));
router.use("/user", require("./user.js"));

router.get("/", function (req, res) {
  res.json({
    message: "Hello,world",
  });
});

//routerをモジュールとして扱う準備
module.exports = router;
