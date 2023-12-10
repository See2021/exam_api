const authJwt = require("../middleware/auth.jwt");
module.exports = (app)=>{
    const category_controller = require("../controllers/category.controller");
    var router = require("express").Router();
    router.get("/:us", category_controller.validTitle);
    router.post("/create", authJwt, category_controller.createNewCategory);
    router.get("/", authJwt, category_controller.getAllCategories);
    router.put("/:id", authJwt, category_controller.updateCategoryCtrl);
    router.delete("/:id", authJwt, category_controller.deleteCategory);
    app.use("/api/category", router);
};