const express = require('express');
const { join } = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// set template engine
app.set("view engine", "ejs");
//app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static('public'));
app.use(cors());


// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const whitePlayer = require('./routes/whitePlayer');
const blackPlayer = require('./routes/blackPlayer');
//const gameHome = require('./routes/gameHome');
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/white", whitePlayer);
app.use("/black", blackPlayer);

app.get('/', (req, res) => {
    //res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected with socket id', socket.id);  
    socket.on('move', (data) => {
        console.log(`Move received from user {${socket.id}}: ${JSON.stringify(data)}`);
        // Emit the 'new-move' event to all connected clients, excluding the sender
        socket.broadcast.emit('new-move', data);
    });
    socket.on('player', (data) => {
        console.log(`Player received from user {${socket.id}}: ${JSON.stringify(data)}`);
        // Emit the 'change-player' event to all connected clients
        io.emit('change-player', data);
    });
    socket.on('win', (data) => {
        console.log(`Player {${socket.id}} is win ${JSON.stringify(data)}`);
        // Emit the 'check-for-win' event to all connected clients, excluding the sender
        socket.broadcast.emit('check-for-win', data);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected with socket id', socket.id);
    });
});


server.listen(3001, () => {
    console.log('listening on http://localhost:3001');
});
