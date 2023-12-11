const authJwt = require("../middleware/auth.jwt");
module.exports = (app)=>{
    const product_controller = require("../controllers/product.controller");
    var router = require("express").Router();
    router.get("/:us", product_controller.validTitle);
    router.post("/create", authJwt, product_controller.createNewProduct);
    router.get("/", authJwt, product_controller.getAllProduct);
    router.put("/:id", authJwt, product_controller.updateProductCtrl);
    router.delete("/:id", authJwt, product_controller.deleteProduct);
    app.use("/api/product", router);
};