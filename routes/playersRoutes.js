const express = require('express');
const router = express.Router();

router.get('/white', (req, res) => {
    if (Array.isArray(req.session.activeUsers) && req.session.activeUsers.includes(req.query.username)) {
        res.render("game-board-view", {
            color: "white",
        });
    } else {
        res.send("Unauthorized access");
    }
});

router.get('/black', (req, res) => {
    if (Array.isArray(req.session.activeUsers) && req.session.activeUsers.includes(req.query.username)) {
        res.render("game-board-view", {
            color: "black",
        });
    } else {
        res.send("Unauthorized access");
    }
});

module.exports = router;
