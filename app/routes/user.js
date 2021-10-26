const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const router = express.Router();
//---------------------------------
//var AdminToken = "true"; //|
//---------------------------------

router.post(
  "/SELECT",
  (req, res, next) => {
    //空値バリデーション
    const AdminToken = req.body.AdminToken;
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];

    bcrypt.compare(AdminToken, process.env.AdminToken, (error, isEqual) => {
      if (error) {
        errors.push("不正なリクエストです/Unauthorized request.");
      } else if (isEqual) {
      }
    });
    if (UserName === "" || UserName === null) {
      errors.push("ユーザーネームエラー/UserName Error.");
    }
    if (PW === "" || PW === null) {
      errors.push("パスワードエラー/Password Error.");
    }
    if (errors.length > 0) {
      res.json({ errors: errors });
    } else {
      next();
    }
  },
  (req, res) => {
    //レコード存在確認バリデーション
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];

    connection.query(
      "SELECT * FROM User_Tables WHERE UserName = ?",
      [UserName],
      (error, results) => {
        if (error) {
          errors.push("ユーザーネームエラー/UserName Error.");
          console.log(error);
        }
        if (results.length === 0 || results.length > 1) {
          errors.push("ユーザーネームエラー/UserName Error.");
        }
        if (errors.length > 0) {
          res.json({ Error: errors });
        } else {
          const hash = results[0].PW;
          bcrypt.compare(PW, hash, (error, isEqual) => {
            if (isEqual) {
              res.json({
                UserId: results[0].UserId,
                UserName: results[0].UserName,
              });
            } else {
              res.json({ Error: "パスワードエラー/Password Error." });
              if (error) {
                console.log(error);
              }
            }
          });
        }
      }
    );
  }
);

router.post(
  "/INSERT",
  (req, res, next) => {
    //空値バリデーション
    const AdminToken = req.body.AdminToken;
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];

    bcrypt.compare(AdminToken, process.env.AdminToken, (error, isEqual) => {
      if (error) {
        errors.push("不正なリクエストです/Unauthorized request.");
      } else if (isEqual) {
      }
    });
    if (UserName === "" || UserName === null) {
      errors.push("ユーザーネームエラー/UserName Error.");
    }
    if (PW === "" || PW === null) {
      errors.push("パスワードエラー/Password Error.");
    }
    if (errors.length > 0) {
      res.json({ errors: errors });
    } else {
      next();
    }
  },
  (req, res, next) => {
    //レコード存在確認バリデーション
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];

    connection.query(
      "SELECT UserId FROM User_Tables WHERE UserName = ?;",
      [UserName],
      (error, results) => {
        if (error) {
          console.log(error);
          errors.push("ユーザーネームエラー/UserName Error.");
        }
        if (results.length > 0) {
          errors.push("ユーザーネームエラー/UserName Error.");
        }
        if (errors.length > 0) {
          res.json({ Error: errors });
        } else {
          next();
        }
      }
    );
  },
  (req, res) => {
    //INSERT
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];

    bcrypt.hash(PW, 10, (error, hash) => {
      if (error) {
        res.json({ Error: "パスワードエラー/Password Error." });
        console.log(error);
      } else {
        connection.query(
          "INSERT INTO User_Tables VALUES (null,?,?);",
          [UserName, hash],
          (error, results) => {
            if (error) {
              console.log(error);
              res.json({ Error: "Error." });
            } else {
              res.json({
                UserId: results.insertId,
                UserName: UserName,
              });
            }
          }
        );
      }
    });
  }
);

//routerをモジュールとして扱う準備
module.exports = router;
