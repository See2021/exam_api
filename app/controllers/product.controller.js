const Product = require("../models/product.model");
const bcrypt = require("bcryptjs");

const validTitle = (req, res) => {
  Product.checkTitle(req.params.us, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.send({
          message: "Not Found: " + req.params.us,
          valid: true,
        });
      } else {
        res.status(500).send({
          message: "Error query: " + req.params.us,
        });
      }
    } else {
      res.send({ record: data, valid: false });
    }
  });
};

const createNewProduct = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const productObj = new Product({
    admin_id: req.body.admin_id,
    pname: req.body.pname,
    amount: req.body.amount,
    descript: req.body.descript,
    status: req.body.status,
  });
  Product.createProduct(productObj, (err, data) => {
    if (err) {
      res
        .status(500)
        .send({ message: err.message || "Some error occured while creating" });
    } else res.send(data);
  });
};

const getAllProduct = (req, res) => {
  Product.getAllRecords((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const updateProductCtrl = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const data = {
    pname: req.body.pname,
    amount: req.body.amount,
    descript: req.body.descript,
    status: req.body.status,
  };
  Product.updateProduct(req.params.id, data, (err, result) => {
    if (err) {
      if (err.kind == "not_found") {
        res
          .status(401)
          .send({ message: "Not found category: " + req.params.id });
      } else {
        res
          .status(500)
          .send({ message: "Error update category: " + req.params.id });
      }
    } else {
      res.send(result);
    }
  });
};

const deleteProduct = (req, res) => {
  console.log("parameters: " + req.params.id);
  Product.removeProduct(req.params.id, (err, result) => {
    if (err) {
      if (err.kind == "not_found") {
        res
          .status(401)
          .send({ message: "Not found category: " + req.params.id });
      } else {
        res
          .status(500)
          .send({ message: "Error delete category: " + req.params.id });
      }
    } else {
      res.send(result);
    }
  });
};
module.exports = {
  validTitle,
  createNewProduct,
  getAllProduct,
  updateProductCtrl,
  deleteProduct
};
