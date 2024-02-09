// socketLogic.js
const { Server } = require('socket.io');

const rooms = new Map();
const usernameToSocketIdMap = new Map();
const clickPlayers = new Map();
const randomPlayers = new Map();

function findSocketIdByUsername(username) {
    return usernameToSocketIdMap.get(username);
}

function getPlayersInfo(data){
    const roomName = data.roomName;
    const players = rooms.get(roomName);

    if(!players || players.length !== 2){ // Check if the room exists and contains players
        console.error(`Invalid room or missing players for room ${roomName}`);
        return;
    }
    const [player_one, player_two] = players;
    const players_info = {
        player_one: {
            socketId : findSocketIdByUsername(player_one),
            username : player_one,
        },
        player_two: {
            socketId : findSocketIdByUsername(player_two),
            username : player_two,
        }
    }
    return players_info;
}

const initializeSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected with socket id', socket.id);

        socket.on('save_username_sockitId', (data) => {
            usernameToSocketIdMap.set(data.username, socket.id);
            console.log('usernameToSocketIdMap: ', usernameToSocketIdMap);
        });
        socket.on('searchedUser', (data) => {
            const { logUsername,  searchedUsername } = data;
            ///usernameToSocketIdMap.set(logUsername, socket.id);
            const searchedUserSocketId = findSocketIdByUsername(searchedUsername);
            clickPlayers.set(logUsername, 0);
            clickPlayers.set(searchedUsername, 0);
            if(searchedUserSocketId){
                io.to(searchedUserSocketId).emit('searchedUserNotification',{player_one: logUsername, player_two : searchedUsername});
            }
        });
        socket.on('accepted-game', (data) => {
            console.log('data accepted-game', data);
    
            const { player_one, player_two } = data;
            const roomName = `${player_one}-${player_two}`;
            //usernameToSocketIdMap.set(player_one, socket.id);
    
            if(findSocketIdByUsername(player_one) == socket.id){
                clickPlayers.set(player_one, 1);
            }
            
            if (clickPlayers.get(player_one) === 1 && clickPlayers.get(player_two) === 1) {// Both players accepted, proceed to start the game
                socket.join(roomName);
                rooms.set(roomName, [player_one, player_two]);
    
                clickPlayers.set(player_one, 0);
                clickPlayers.set(player_two, 0);
    
                const playerOneSocketId = findSocketIdByUsername(player_one);
                const playerTwoSocketId = findSocketIdByUsername(player_two);
                
                io.to(playerOneSocketId).emit('join-room', { roomName, username: player_one, side: 'white' });
                io.to(playerTwoSocketId).emit('join-room', { roomName, username: player_two, side: 'black' });
            }
        });
        socket.on('join-game', (data)=>{
            console.log('data from join-game',data);
    
            const roomName = data.roomName;
            socket.join(roomName);
            const {player_one, player_two} = getPlayersInfo(data);
    
            io.to(player_one.socketId).emit('join-player', {roomName: roomName, player_one: player_one.username, player_two: player_two.username});
            io.to(player_two.socketId).emit('join-player', {roomName: roomName, player_one: player_one.username, player_two: player_two.username});
        });
        socket.on('decline-invite', (data)=>{
            console.log('decline-invite',data)
            const player_two_socketId = findSocketIdByUsername(data.player_two);
            io.to(player_two_socketId).emit('decline-invite-alert');
        });
        socket.on('find-user', (data)=>{
            console.log('data from find-user', data)
            randomPlayers.set(data.username, 1);
            let cnt= 0;
            let players = [];
            for (const entry of randomPlayers.entries()) {
                const [key, value] = entry;
                if(value === 1){
                    cnt++;
                    players.push(key);
                }
                if(cnt === 2){
                    randomPlayers.set(players[0],0);
                    randomPlayers.set(players[1],0);
                    const player_one_socketId = findSocketIdByUsername(players[0]);
                    const player_two_socketId = findSocketIdByUsername(players[1]);
                    io.to(player_one_socketId).emit('searchedUserNotification',{player_one: players[0], player_two: players[1]});
                    io.to(player_two_socketId).emit('searchedUserNotification',{player_one: players[0], player_two: players[1]});
                    players = [];
                    cnt = 0;
                }
            }
        });
        socket.on('move', (data) => {
            console.log(`Move received in room {${data.roomName}} from user {${socket.id}}: ${JSON.stringify(data)}`);
            
            const {player_one, player_two} = getPlayersInfo(data);
    
            if(data.username == player_one.username){
                io.to(player_two.socketId).emit('new-move', data);
            }
            else if(data.username == player_two.username){
                io.to(player_one.socketId).emit('new-move', data);
            }
        });
        socket.on('player', (data) => {
            console.log(`Player received in room {${data.roomName}} from user {${socket.id}}: ${JSON.stringify(data)}`);
            
            const {player_one, player_two} = getPlayersInfo(data);
    
            io.to(player_one.socketId).emit('change-player', data);
            io.to(player_two.socketId).emit('change-player', data);
        });
        socket.on('win', (data) => {
            console.log(`Win player with socketId {${socket.id}} in room ${data.roomName} : ${JSON.stringify(data)}`);
    
            const {player_one, player_two} = getPlayersInfo(data);
    
            if(data.username == player_one.username){
                io.to(player_two.socketId).emit('check-for-win', data);
            }
            else if(data.username == player_two.username){
                io.to(player_one.socketId).emit('check-for-win', data);
            }
        });
        socket.on('withdrawal-player',(data)=>{
            console.log('withdrawal-player: ', data)
            const {player_one, player_two} = getPlayersInfo(data);
            
            if(data.username == player_one.username){
                io.to(player_two.socketId).emit('quit', data);
            }
            else if(data.username == player_two.username){
                io.to(player_one.socketId).emit('quit', data);
            }
        })  
        
        socket.on('disconnect', () => {
            console.log('user disconnected with socket id', socket.id);
            const usernameToRemove = Array.from(usernameToSocketIdMap.keys()).find(
                (username) => usernameToSocketIdMap.get(username) === socket.id
            );
            if (usernameToRemove) {
                usernameToSocketIdMap.delete(usernameToRemove);
                console.log(`Removed ${usernameToRemove} from usernameToSocketIdMap`);
            }
        });
    });

    return io;
};

module.exports = {
    initializeSocket,
    rooms,
    usernameToSocketIdMap,
    clickPlayers,
    randomPlayers,
    findSocketIdByUsername,
    getPlayersInfo,
};
