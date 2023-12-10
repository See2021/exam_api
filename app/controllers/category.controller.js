const Category = require("../models/category.model");
const bcrypt = require("bcryptjs");

const validTitle = (req, res) => {
  Category.checkTitle(req.params.us, (err, data) => {
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

const createNewCategory = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const categoryObj = new Category({
    admin_id: req.body.admin_id,
    title: req.body.title,
    amount: req.body.amount,
    descript: req.body.descript,
  });
  Category.createCategory(categoryObj, (err, data) => {
    if (err) {
      res
        .status(500)
        .send({ message: err.message || "Some error occured while creating" });
    } else res.send(data);
  });
};

const getAllCategories = (req, res) => {
  Category.getAllRecords((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const updateCategoryCtrl = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const data = {
    title: req.body.title,
    amount: req.body.amount,
    descript: req.body.descript,
  };
  Category.updateCategory(req.params.id, data, (err, result) => {
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

const deleteCategory = (req, res) => {
  console.log("parameters: " + req.params.id);
  Category.removeCategory(req.params.id, (err, result) => {
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
  createNewCategory,
  getAllCategories,
  updateCategoryCtrl,
  deleteCategory,
};
