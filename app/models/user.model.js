const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const expireTime = "2h"; //token will expire in 2 hours
const fs = require("fs");

const User = function (Users) {
  this.admin_id = Users.admin_id;
  this.fullname = Users.fullname;
  this.email = Users.email;
  this.password = Users.password;
  this.img = Users.img;
};

User.checkUsername = (fullname, result) => {
  sql.query(
    "SELECT * FROM Users WHERE fullname='" + fullname + "'",
    (err, res) => {
      if (err) {
        console.log("Error: " + err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Found fullname: " + res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO Users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    const token = jwt.sign({ id: res.insertId }, scKey.secret, {
      expiresIn: expireTime,
    });
    result(null, { id: res.insertId, ...newUser, accessToken: token });
    console.log("Created user:", {
      id: res.insertId,
      ...newUser,
      accessToken: token,
    });
  });
};

User.loginModel = (account, result) => {
  sql.query(
    "SELECT * FROM Users WHERE fullname=?",
    [account.fullname],
    (err, res) => {
      if (err) {
        console.log("err:" + err);
        result(err, null);
        return;
      }
      if (res.length) {
        const validPassword = bcrypt.compareSync(
          account.password,
          res[0].password
        );
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

User.getAllRecords = (result) => {
  sql.query("SELECT * FROM Users", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

const removeOldImage = (id, result) => {
  sql.query("SELECT * FROM Users WHERE id=?", [id], (err, res) => {
    if (err) {
      console.log("error:" + err);
      result(err, null);
      return;
    }
    if (res.length) {
      let filePath = __basedir + "/assets/" + res[0].img;
      try {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (e) => {
            if (e) {
              console.log("Error: " + e);
              return;
            } else {
              console.log("File: " + res[0].img + " was removed");
              return;
            }
          });
        } else {
          console.log("File: " + res[0].img + " not found.");
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  });
};

User.updateUser = (id, data, result) => {
  removeOldImage(id);
  sql.query(
    "UPDATE Users SET fullname=?, email=?, password, img=? WHERE id=?",
    [data.fullname, data.email, data.password, data.img, id],
    (err, res) => {
      (err, res) => {
        if (err) {
          console.log("Error: " + err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          //NO any record update
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Update user: " + { id: id, ...data });
        result(null, { id: id, ...data });
        return;
      };
    }
  );
};

User.removeUser = (id, result) => {
  removeOldImage(id);
  sql.query("DELETE FROM Users WHERE id=?", [id], (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted user id: " + id);
    result(null, { id: id });
  });
};
module.exports = User;
