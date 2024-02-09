require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { initializeSocket } = require('./socket/socketLogic');
const database = require('./models/conn');
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(cors());

// Routes
const login_system_Route = require('./routes/loginSystemRoutes');
const players = require('./routes/playersRoutes');
const find_opponent = require('./routes/find-opponent-Routes');
app.use("/find-opponent", find_opponent);
app.use("/", login_system_Route);
app.use("/", players);

// Socket.IO setup
const io = initializeSocket(server);

server.listen(process.env.PORT || 3001, () => {
    console.log(`listening on http://localhost:${process.env.PORT}`);
});



