const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();

app.use(express.urlencoded({ extended: false }));
// jsonを使えるようにする
app.use(express.json());

// "app/route"を定数routerに読み込む
const router = require("./routes/");
//　outerを"/api/"アクセスのapiとして扱う
app.use("/api/", router);

// CORS設定。異なるURLからでも呼び出せるようにする
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// 環境変数PORT || 3000　をポート番号に指定
const port = process.env.PORT || 3000;

//サーバ起動
app.listen(port);
console.log("listen on port " + port);
