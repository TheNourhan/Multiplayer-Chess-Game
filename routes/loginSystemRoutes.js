const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const usersController = require('../controllers/loginSystemController');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "views");

router.route('/login')
    .get((req, res)=>{
        var payload = {
            pageTitle:  "Login",
            error : null
        }
        res.status(200).render("login", payload);
    })
    .post(usersController.login);

router.route('/register')
    .get((req, res) => {
        var payload = {
            pageTitle:  "Register",
        };
        res.status(200).render("register", payload);
    })
    .post(usersController.register);


router.route('/logout')
    .get(usersController.logout);

module.exports = router;

