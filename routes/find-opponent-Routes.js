const express = require('express');
const router = express.Router();
const app = express();
const find_opponent_controller = require('../controllers/find-opponent-controller');

app.set("view engine", "ejs");
app.set("views", "views");

router.route('/')
    .get(find_opponent_controller.check_session)
    .post(find_opponent_controller.find_searched_user);

module.exports = router;


