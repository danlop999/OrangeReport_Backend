## npmでインストール

<code>npm install --save express express-session ejs mysql2</code><br>


## Expressコマンドでひな形生成を行う方法

<code>express --view=ejs</code><br>
* <a href="https://qiita.com/t_skri/items/48948c0c2bfd535cf7d2">Node.js Expressフレームワークを使用する（ひな型作成）</a><br>


## sqlファイル読み込みによるクエリー実行
* <a href="https://dev.mysql.com/doc/refman/5.6/ja/mysql-batch-commands.html">4.5.1.5 テキストファイルから SQL ステートメントを実行する</a><br>


## 注意点
<code>const mysql = require('mysql');</code> => <code>const mysql = require('mysql2');</code><br>
<p>"mysql" => "mysql2" に変更</p><br>
