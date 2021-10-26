const express = require("express");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "OrangeReport",
});
const router = express.Router();

// GET  http://localhost:3000/api/v1/article/test
router.get("/", (req, res) => {
  connection.query(
    "SELECT ArticlesId,Title,Summary,LimitedFlag FROM Articles_Tables;",
    (error, results) => {
      res.json({ data: results });
    }
  );
});

router.get("/:ArticlesId", (req, res) => {
  const ArticlesId = req.params.ArticlesId;
  connection.query(
    "SELECT * FROM Articles_Tables WHERE ArticlesId = ?;",
    [ArticlesId],
    (error, results) => {
      res.json({ data: results });
    }
  );
});

//routerをモジュールとして扱う準備
module.exports = router;
