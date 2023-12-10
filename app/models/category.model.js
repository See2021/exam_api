const sql = require("./db");

const Category = function (Categories) {
  this.admin_id = Categories.admin_id;
  this.title = Categories.title;
  this.amount = Categories.amount;
  this.descript = Categories.descript;
};

Category.checkTitle = (title, result) => {
  sql.query(
    "SELECT * FROM Categories WHERE title='" + title + "'",
    (err, res) => {
      if (err) {
        console.log("Error: " + err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Found title: " + res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

Category.createCategory = (newCategory, result) => {
  sql.query(
    "INSERT INTO Categories (admin_id, title, amount, descript) VALUES (?, ?, ?, ?)",
    [
      newCategory.admin_id,
      newCategory.title,
      newCategory.amount,
      newCategory.descript,
    ],
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newCategory });
      console.log("Created category:", {
        id: res.insertId,
        ...newCategory,
      });
    }
  );
};

Category.getAllRecords = (result) => {
  sql.query("SELECT * FROM Categories", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Category.updateCategory = (id, data, result) => {
  sql.query(
    "UPDATE Categories SET title = COALESCE(?, title), amount = COALESCE(?, amount), descript = COALESCE(?, descript) WHERE id = ?",
    [data.title, data.amount, data.descript, id],
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
      console.log("Update category: " + { id: id, ...data });
      result(null, { id: id, ...data });
      return;
    }
  );
};

Category.removeCategory = (id, result) => {
  sql.query("DELETE FROM Categories WHERE id=?", [id], (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted category id: " + id);
    result(null, { id: id });
  });
};
module.exports = Category;
