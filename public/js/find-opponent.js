const buttons = document.querySelectorAll('.mybutton');

buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.boxShadow = "0 0 2em 0.2em hsl(186 100% 69%)";
    });

    button.addEventListener('mouseout', () => {
        button.style.boxShadow = "";
    });
});

/***************************** {SOCKET.IO} *****************************/
const socket = io();

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const logUsername = getQueryParam('logUsername');

const my_username = document.querySelector('.my-username');
my_username.textContent = `Hello, ${logUsername}`;

const searchedUser = document.querySelector('#hidden-search-username');
socket.emit('save_username_sockitId', {username: logUsername});


/***************************** Find By Username *****************************/

const joinGameLabel = document.querySelector('#join-game');
const send_invite = document.querySelector('#send-invite');
const decline_invite = document.querySelector('#decline-invite');
const receive_invite = document.querySelector('#receive-invite');

if (searchedUser.value && searchedUser.value !== '-1') {
    send_invite.textContent = logUsername;
    receive_invite.textContent = searchedUser.value;
    joinGameLabel.style.display = 'block';
    socket.emit('searchedUser', {logUsername: logUsername, searchedUsername: searchedUser.value });
}else if(searchedUser.value === '-1'){
    const showMessage = document.querySelector('.decline');
    showMessage.innerText = 'Inactive user';
    decline_invite.style.display = 'block';
}else{
    joinGameLabel.style.display = 'none';
    decline_invite.style.display = 'none';
}

socket.on('searchedUserNotification',(data)=>{
    console.log('data from search', data);
    send_invite.textContent = data.player_one;
    receive_invite.textContent = data.player_two;
    joinGameLabel.style.display = 'block';
    
    if(!searchedUser.value || searchedUser.value === '-1'){
        if(logUsername == data.player_two){
            searchedUser.value = data.player_one;
        }
    }
});

const accepted_game_btn = document.querySelector('#accepted-game');
accepted_game_btn.addEventListener('click', ()=>{
    socket.emit('accepted-game', {
        player_one : logUsername,
        player_two : searchedUser.value,
    });
});
const refused_game_btn = document.querySelector('#refused-game');
refused_game_btn.addEventListener('click', ()=>{
    joinGameLabel.style.display = 'none';
    socket.emit('decline-invite', {
        player_one : logUsername,
        player_two : searchedUser.value,
    });
    searchedUser.value = '';
});

socket.on('decline-invite-alert', ()=>{
    joinGameLabel.style.display = 'none';
    decline_invite.style.display = 'block';
    searchedUser.value = '';
});

socket.on('join-room', (data) => {
    const { roomName, username, side } = data;
    console.log(`Game started in room ${roomName} with ${username} playing on the ${side} side.`);
    window.location.href = `/${side}?username=${encodeURIComponent(logUsername)}&room=${roomName}`;
});
/***************************** Find By Random Selection *****************************/

const random_selection_btn = document.querySelector('#random-selection-btn');
random_selection_btn.addEventListener('click', ()=>{
    socket.emit('find-user', {username: logUsername});
});

