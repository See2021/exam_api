const sql = require("./db");

const Product = function (Product) {
  this.admin_id = Product.admin_id;
  this.pname = Product.pname;
  this.amount = Product.amount;
  this.descript = Product.descript;
  this.status = Product.status;
};

Product.checkTitle = (pname, result) => {
  sql.query("SELECT * FROM Product WHERE pname='" + pname + "'", (err, res) => {
    if (err) {
      console.log("Error: " + err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("Found pname: " + res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Product.createProduct = (newProduct, result) => {
  sql.query(
    "INSERT INTO Product (admin_id, pname, amount, descript, status) VALUES (?, ?, ?, ?, ?)",
    [
      newProduct.admin_id,
      newProduct.pname,
      newProduct.amount,
      newProduct.descript,
      newProduct.status,
    ],
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newProduct });
      console.log("Created Product:", {
        id: res.insertId,
        ...newProduct,
      });
    }
  );
};

Product.getAllRecords = (result) => {
  sql.query("SELECT * FROM Product", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Product.updateProduct = (id, data, result) => {
  sql.query(
    "UPDATE Product SET pname = COALESCE(?, pname), amount = COALESCE(?, amount), descript = COALESCE(?, descript), status = COALESCE(?, status) WHERE id = ?",
    [data.title, data.amount, data.descript, data.status, id],
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
      console.log("Update Product: " + { id: id, ...data });
      result(null, { id: id, ...data });
      return;
    }
  );
};

Product.removeProduct = (id, result) => {
  sql.query("DELETE FROM Product WHERE id=?", [id], (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted product id: " + id);
    result(null, { id: id });
  });
};

module.exports = Product;
