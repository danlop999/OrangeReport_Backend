const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "OrangeReport",
});

const router = express.Router();

router.post(
  "/SELECT",
  (req, res, next) => {
    //空値バリデーション
    const AdminPW = process.env.AdminToken;
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];
    if (AdminPW !== process.env.AdminToken || 1 !== 1) {
      errors.push("不正なリクエストです/Unauthorized request.");
    } else if (UserName === "" || UserName === null) {
      errors.push("ユーザーネームエラー/UserName Error.");
    } else if (PW === "" || PW === null) {
      errors.push("パスワードエラー/Password Error.");
    } else if (errors.length > 0) {
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
      "SELECT * FROM User_Tables WHERE UserName = ?;",
      [UserName],
      (error, results) => {
        if (error) {
          errors.push("ユーザーネームエラー/UserName Error.");
        } else if (results[1] !== null) {
          errors.push("ユーザーネームエラー/UserName Error.");
        } else if (errors.length > 0) {
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
    const AdminPW = process.env.AdminToken;
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];
    if (AdminPW !== process.env.AdminToken || 1 !== 1) {
      errors.push("不正なリクエストです/Unauthorized request.");
    } else if (UserName === "" || UserName === null) {
      errors.push("1ユーザーネームエラー/UserName Error.");
    } else if (PW === "" || PW === null) {
      errors.push("パスワードエラー/Password Error.");
    } else if (errors.length > 0) {
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
          errors.push("2ユーザーネームエラー/UserName Error.");
          console.log(error);
        } else if (results[1] !== null) {
          errors.push("3ユーザーネームエラー/UserName Error.");
        } else if (errors.length > 0) {
          res.json({ Error: errors });
        } else {
          next();
        }
      }
    );
  },
  (req, res) => {
    //NSERT
    const UserName = req.body.UserName;
    const PW = req.body.PW;
    const errors = [];
    bcrypt.hash(PW, 10, (error, hash) => {
      if (error) {
        res.json({ Error: "1パスワードエラー/Password Error." });
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
                UserId: results[0].UserId,
                UserName: results[0].UserName,
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
