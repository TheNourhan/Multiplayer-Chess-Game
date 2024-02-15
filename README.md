# Multiplayer-Chess-Game

## Overview
A multiplayer chess game web application built using JavaScript, Node.js, Express.js, MongoDB, Socket.IO, EJS, and CSS. The game allows users to play chess against opponents in real-time, either by searching for specific usernames or by randomly selecting opponents.

## Features

- **Login System:**  Integrated user authentication system with options for registering an account, logging in, and logging out.
- **Real-Time Opponent Finding**:
  - **Search by ID**: Users can search for opponents by specifying their usernames, allowing for personalized matchmaking.
  - **Random Selection**: Alternatively, users can opt for random opponent selection, providing a quick and easy way to start a game without specifying a username.
- **Game Board:** Interactive chessboard with pieces, highlighting legal moves, and capturing animations.
- **Real-Time Communication:** Real-time game updates using Socket.IO.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TheNourhan/Multiplayer-Chess-Game.git
   ```

2. Navigate to the project directory:
    ```bash
    cd Multiplayer-Chess-Game
    ```

3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
   Create a .env file in the root directory and add the following:

    ```bash
    SESSION_SECRET=your_session_secret
    MONGO_URL=your_url
    PORT=3001
    ```
5. Start the server:
    ```bash
    npm start
    ```
6. Open http://localhost:3001 in your web browser.

## Usage
1. Log in with your credentials or create a new account.
2. Navigate to the "Find Opponent" section to start a new game.
3. Click on a piece to select it and see available moves highlighted.
4. Make your move by clicking on the destination square.
5. Enjoy playing chess with friends or random opponents!

## Technologies Used
1. Node.js
2. Express.js
3. Socket.IO
4. MongoDB
5. JavaScript
6. EJS
7. CSS

## Contributing
Contributions are welcome! Please follow these guidelines:

Fork the repository and create a new branch for your feature or bug fix.
Make your changes and test them thoroughly.
Submit a pull request with a clear description of your changes.


Feel free to customize and expand upon this template as needed to better fit your project and its features. Make sure to replace placeholders like `your_session_secret` with actual values, and add any additional sections or details specific to your application.
