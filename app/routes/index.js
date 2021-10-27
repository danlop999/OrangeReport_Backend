const express = require("express");
require("dotenv").config();

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
