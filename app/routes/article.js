const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
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

//SELECT *
router.get("/", (req, res) => {
  const errors = [];

  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT ArticlesId,Title,Summary,LimitedFlag FROM Articles_Tables;",
      (error, results) => {
        //console.log(res.json(results));
        res.json(results);
        connection.release();
      }
    );
  });
});

//SELECT ArticlesId
router.get("/:ArticlesId", (req, res) => {
  const ArticlesId = req.params.ArticlesId;
  const errors = [];

  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT * FROM Articles_Tables WHERE ArticlesId = ?;",
      [ArticlesId],
      (error, results) => {
        if (error || results.length > 1 || results.length < 1) {
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
          });
        }
        connection.release();
      }
    );
  });
});

//INSERT
router.post(
  "/INSERT",
  (req, res, next) => {
    //空値バリデーション
    const AdminToken = req.body.AdminToken;
    const Title = req.body.Title;
    const Summary = req.body.Summary;
    const Content = req.body.Content;
    const LimitedFlag = req.body.LimitedFlag;
    const errors = [];

    bcrypt.compare(AdminToken, process.env.AdminToken, (error, isEqual) => {
      if (error) {
        errors.push("不正なリクエストです/Unauthorized request.");
        console.log(error);
      } else if (isEqual) {
      }
    });
    if (Title === "" || Title === null) {
      errors.push("Titleエラー/Title Error.");
    }
    if (Summary === "" || Summary === null) {
      errors.push("Summaryエラー/Summary Error.");
    }
    if (Content === "" || Content === null) {
      errors.push("Contentエラー/ContentError.");
    }
    if (
      LimitedFlag === "" ||
      LimitedFlag === null ||
      LimitedFlag > 1 ||
      LimitedFlag < 0
    ) {
      errors.push("LimitedFlagエラー/LimitedFlag Error.");
    }
    if (errors.length > 0) {
      res.json({ errors: errors });
    } else {
      next();
    }
  },
  (req, res) => {
    //INSERT
    const Title = req.body.Title;
    const Summary = req.body.Summary;
    const Content = req.body.Content;
    const LimitedFlag = req.body.LimitedFlag;

    pool.getConnection(function (err, connection) {
      connection.query(
        "INSERT INTO Articles_Tables (Title,Summary,Content,LimitedFlag) VALUES (?,?,?,?);",
        [Title, Summary, Content, LimitedFlag],
        (error, results) => {
          if (error) {
            console.log(error);
            res.json({ Error: "Error." });
          } else {
            res.json({ ArticlesId: results.insertId });
          }
          connection.release();
        }
      );
    });
  }
);
//routerをモジュールとして扱う準備
module.exports = router;
