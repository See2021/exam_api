const Admin = require("../models/admin.model")

const login = (req, res)=>{
    if(!req.body){
        res.status(400).send({message: "Content can not be empty."});
    }
    const acc = new Admin({
        email: req.body.email,
        password: req.body.password
    });
    Admin.loginModel(acc, (err, data)=>{
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send({message: "Not found " + req.body.email});
            }
            else if(err.kind == "invalid_pass"){
                res.status(401).send({message: "Invalid Password"});
            }else{
                res.status(500).send({message: "Query error." });
            }
        }else res.send(data);
    });
};

module.exports = {login};