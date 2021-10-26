const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

var db_config = {
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
var pool = mysql.createPool(db_config);

const router = express.Router();
//---------------------------------
//var AdminToken = "true"; //|
//---------------------------------

router.get("/", (req, res) => {
  const errors = [];

  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT ArticlesId,Title,Summary,LimitedFlag FROM Articles_Tables;",
      (error, results) => {
        res.json({ results });
        connection.release();
      }
    );
  });
});

router.get("/:ArticlesId", (req, res) => {
  const ArticlesId = req.params.ArticlesId;
  const errors = [];

  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT * FROM Articles_Tables WHERE ArticlesId = ?;",
      [ArticlesId],
      (error, results) => {
        if (error || results.length == 0) {
          errors.push("ArticlesIdエラー/ArticlesId Error.");
        }
        if (errors.length > 0) {
          res.json({ Error: errors });
        } else {
          res.json({
            ArticlesId: results[0].ArticlesId,
            Title: results[0].Title,
            Summary: results[0].Summary,
            Content: results[0].Content,
            LimitedFlag: results[0].LimitedFlag,
          });
        }
        connection.release();
      }
    );
  });
});

//routerをモジュールとして扱う準備
module.exports = router;
