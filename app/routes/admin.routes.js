module.exports = (app)=>{
    const admin_controller = require("../controllers/admin.controller");
    var router = require("express").Router();
    router.post("/login", admin_controller.login);
    app.use("/api/admin", router);
};