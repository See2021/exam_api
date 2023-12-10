const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const expireTime = "2h"; //token will expire in 2 hours
const fs = require("fs");

const Admin = function (Admin) {
  this.email = Admin.email;
  this.password = Admin.password;
};

Admin.loginModel = (account, result) => {
  sql.query(
    "SELECT * FROM Admin WHERE email=?",
    [account.email],
    (err, res) => {
      if (err) {
        console.log("err:" + err);
        result(err, null);
        return;
      }
      if (res.length) {
        const validPassword = (account.password, res[0].password);
        if (validPassword) {
          const token = jwt.sign({ id: res.insertId }, scKey.secret, {
            expiresIn: expireTime,
          });
          console.log("Login success. Token: " + token);
          res[0].accessToken = token;
          result(null, res[0]);
          return;
        } else {
          console.log("Password not match");
          result({ kind: "invalid_pass" }, null);
          return;
        }
      }
      result({ kind: "not_found" }, null);
    }
  );
};

module.exports = Admin;
