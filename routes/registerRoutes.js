const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: false}));

router.get("/",  (req, res, next)=>{
    var payload = {
        pageTitle:  "Register",
    }
    res.status(200).render("register", payload);
});
/*
router.post("/",  (req, res, next)=>{
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password= req.body.password;

    var payload = req.body;
    console.log(payload);
    if(username && email && password){
        
    }else{
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(200).render("register", payload);
    }
});
*/
module.exports = router;