let timerX, timerO; // Timers in seconds
let intervalX, intervalO;
let playerNameX = 'Player X'; // Default names
let playerNameO = 'Player O';
let gameDuration; // in seconds
let teamNames = { rows: [], cols: [] };
let currentPlayer = 'X'; // 'X' starts the game
const board = Array(9).fill(null);

document.getElementById('set-game').addEventListener('click', function() {
    playerNameX = document.getElementById('player-x-name').value || 'Player X';
    playerNameO = document.getElementById('player-o-name').value || 'Player O';
    gameDuration = parseInt(document.getElementById('game-timer').value, 10) || 60; // Default to 60 seconds

    document.getElementById('player-info').style.display = 'none';
    document.getElementById('team-inputs').style.display = 'block';
});

document.getElementById('start-game').addEventListener('click', function() {
    console.log("Game started");
    teamNames.rows = [
        document.getElementById('team-row1').value,
        document.getElementById('team-row2').value,
        document.getElementById('team-row3').value
    ];
    teamNames.cols = [
        document.getElementById('team-col1').value,
        document.getElementById('team-col2').value,
        document.getElementById('team-col3').value
    ];

    displayTeamNames();
    document.getElementById('team-inputs').style.display = 'none';
    document.getElementById('team-names-display').style.display = 'block';
    document.getElementById('game-board').style.display = 'grid';
    document.getElementById('timers').style.display = 'block';

    timerX = timerO = gameDuration;
    updateTimers();
    startTimer(currentPlayer); // Start the timer for the first player
    updateTurnHeader();
    updateTimerHeaders();
    createBoard();
});

function displayTeamNames() {
    const rowNamesDiv = document.getElementById('row-names');
    const colNamesDiv = document.getElementById('col-names');
    rowNamesDiv.innerHTML = teamNames.rows.map(name => `<div>${name}</div>`).join('');
    colNamesDiv.innerHTML = teamNames.cols.map(name => `<span>${name}</span>`).join('');
}

function createBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = ''; // Clear previous board
    board.forEach((_, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', cellClicked);
        boardElement.appendChild(cellElement);
    });
}

function cellClicked(event) {
    const cellElement = event.target;
    const index = parseInt(cellElement.dataset.index, 10);

    if (!board[index]) {
        let playerName = prompt(`Enter a player's name for ${teamNames.rows[Math.floor(index / 3)]} vs ${teamNames.cols[index % 3]}`);
        if (playerName) {
            board[index] = currentPlayer;
            cellElement.textContent = playerName;
            cellElement.classList.add(currentPlayer);
            if (checkWinner()) {
                // Delay before announcing the winner
                setTimeout(function() {
                    alert(`${currentPlayer === 'X' ? playerNameX : playerNameO} wins!`);
                    resetBoard();
                }, 1000); // 1-second delay
            } else if (!board.includes(null)) {
                setTimeout(function() {
                    alert("It's a tie!");
                    resetBoard();
                }, 1000); // 1-second delay
            } else {
                toggleTimer();
                updateTurnHeader();
            }
        }
    }
}

function toggleTimer() {
    clearInterval(currentPlayer === 'X' ? intervalX : intervalO);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    startTimer(currentPlayer);
}

function startTimer(player) {
    clearInterval(intervalX);
    clearInterval(intervalO);

    // Select the timer elements
    const timerElementX = document.getElementById('time-x');
    const timerElementO = document.getElementById('time-o');

    const updateInterval = () => {
        if (player === 'X') {
            timerX--;
            timerElementX.textContent = formatTime(timerX);
            if (timerX <= 0) {
                clearInterval(intervalX);
                endGame(playerNameO);
            }
        } else {
            timerO--;
            timerElementO.textContent = formatTime(timerO);
            if (timerO <= 0) {
                clearInterval(intervalO);
                endGame(playerNameX);
            }
        }
    };

    if (player === 'X') {
        intervalX = setInterval(updateInterval, 1000);
    } else {
        intervalO = setInterval(updateInterval, 1000);
    }
}


function endGame(winnerName) {
    alert(`${winnerName} wins!`);
    resetBoard();
}

function updateTimers() {
    console.log("Updating timers:", timerX, timerO);
    document.getElementById('time-x').textContent = formatTime(timerX);
    document.getElementById('time-o').textContent = formatTime(timerO);
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTurnHeader() {
    const currentPlayerName = currentPlayer === 'X' ? playerNameX : playerNameO;
    document.getElementById('turn-header').textContent = `${currentPlayerName}'s Turn`;
    document.getElementById('turn-header').style.display = 'block'; // Ensure it's visible
}

function updateTimerHeaders() {
    document.getElementById('timer-x').textContent = `${playerNameX}: `;
    document.getElementById('timer-o').textContent = `${playerNameO}: `;
}

function resetBoard() {
    board.fill(null);
    createBoard();
    currentPlayer = 'X';
    updateTurnHeader();
    timerX = timerO = gameDuration;
    updateTimers();
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}
