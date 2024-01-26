const express = require('express');
const app = express();
const router = express.Router();

app.set("view engine", "ejs");
//app.set("views", "views");

router.get('/', (req, res) => {
    res.render("index", {
        color: "black",
    });
    //res.sendFile(join(__dirname, 'index.html'));
});

module.exports = router;

