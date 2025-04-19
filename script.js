const navLinks = document.querySelectorAll('.nav-bar a');
const contents = document.querySelectorAll('.content');
let walletAmount = 0;
let selectedMatchType = '';
let selectedPrize = null;
let activeChallenges = []; // Holds all active challenges
let inWebsiteChallenges = []; // Holds challenges from the website (Head to Head, Squad Match, etc.)

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const tab = this.dataset.tab;
        navLinks.forEach(l => l.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});

function addFunds() {
    const amount = parseFloat(document.getElementById('addAmount').value);
    if (!isNaN(amount) && amount > 0) {
        walletAmount += amount;
        document.getElementById('walletAmount').textContent = walletAmount;
        document.getElementById('profileBalance').textContent = walletAmount;
        document.getElementById('addAmount').value = '';
    } else {
        alert("Enter valid amount");
    }
}

function selectMatchType(type) {
    selectedMatchType = type;

    // Remove selected class from all match type buttons
    document.querySelectorAll('.create-challenge button').forEach(btn => {
        if (btn.textContent === '1v1' || btn.textContent === 'Squad vs Squad' || btn.textContent === 'Freely') {
            btn.classList.remove('selected');
        }
    });

    // Add selected class to the clicked button
    const buttons = document.querySelectorAll('.create-challenge button');
    buttons.forEach(btn => {
        if (btn.textContent === type) {
            btn.classList.add('selected');
        }
    });
}

function selectPrize(amount) {
    selectedPrize = amount;

    // Remove selected class from all prize buttons
    document.querySelectorAll('.create-challenge button').forEach(btn => {
        if (btn.textContent === '10' || btn.textContent === '100' || btn.textContent === '200') {
            btn.classList.remove('selected');
        }
    });

    // Add selected class to the clicked button
    const buttons = document.querySelectorAll('.create-challenge button');
    buttons.forEach(btn => {
        if (btn.textContent === amount.toString()) {
            btn.classList.add('selected');
        }
    });
}


function submitChallenge() {
    const game = document.getElementById('createGame').value;
    const selectedMatchType = document.getElementById('options').value;
    const prize = parseInt(document.getElementById('customPrize').value);
    const gameLink = document.getElementById('gameLink').value;

    if (!selectedMatchType || isNaN(prize) || prize < 10 || prize % 5 !== 0) {
        alert("Please select a match type and enter a valid prize amount (min ₹10, steps of 5).");
        return;
    }

    // Create a challenge object
    const challenge = {
        matchType: selectedMatchType,
        game: game,
        prize: prize,
        link: gameLink
    };

    // Add the challenge to active challenges
    activeChallenges.push(challenge);

    // Render Active Challenges
    renderActiveChallenges();

    // Reset the form after submitting
    document.getElementById('options').value = '';
    document.getElementById('customPrize').value = 10;
    document.getElementById('gameLink').value = '';  // Reset the game link field

    alert("Challenge created!");
}

function renderActiveChallenges() {
    const container = document.getElementById('submittedChallenges');
    container.innerHTML = ''; // Clear previous challenges

    // Loop through all active challenges and add them to the DOM
    activeChallenges.forEach(challenge => {
        const challengeDiv = document.createElement('div');
        challengeDiv.className = 'challenge-block';
        challengeDiv.innerHTML = `
            <h4>${challenge.matchType} - ₹${challenge.prize}</h4>
            <p>Game: ${challenge.game}</p>
            <p><strong>Game Link: </strong><a href="${challenge.link}" target="_blank">${challenge.link}</a></p>
            <button onclick="enterChallenge('${challenge.matchType}', this)">Enter</button>
            <button onclick="acceptChallenge(this)">Accept</button>
            <button onclick="shareChallenge()">Share</button>
        `;
        container.appendChild(challengeDiv);
    });
}




function enterChallenge(type, btn) {
    const prizeInput = btn.parentElement.querySelector('.prizeInput');
    const prize = parseInt(prizeInput.value);
    let gameLink = '#';  // Set placeholder link to '#'

    // Get the corresponding game link based on the challenge type (currently set to #)
    if (type === 'Head to Head') {
        gameLink = '#';  // Placeholder link
    } else if (type === 'Squad Match') {
        gameLink = '#';  // Placeholder link
    } else if (type === '50 Tournament') {
        gameLink = '#';  // Placeholder link
    }

    const gameSelect = btn.parentElement.querySelector('select');
    const game = gameSelect ? gameSelect.value : '';

    if (isNaN(prize) || prize < 10 || prize % 5 !== 0) {
        alert("Please enter a valid prize amount (starting at ₹10, steps of 5)");
        return;
    }

    // Add In Website Challenges to Active Challenges section
    const activeChallengesContainer = document.getElementById('submittedChallenges');
    const challengeDiv = document.createElement('div');
    challengeDiv.className = 'challenge-block';

    // Add challenge details to Active Challenges
    challengeDiv.innerHTML = `
        <h4>${type} - ₹${prize}</h4>
        <p>Game: ${game}</p>
        <p><strong>Game Link:</strong> <a href="${gameLink}" target="_blank">${gameLink}</a></p>
        <button onclick="startGame()">Start Game</button>
        <button onclick="shareChallenge()">Share</button>
    `;

    // Prepend to Active Challenges container
    activeChallengesContainer.prepend(challengeDiv);

    alert(`Entered ${type} with ₹${prize}`);
}


let chatTimerInterval;
let remainingSeconds = 300;

function acceptChallenge(button) {
    document.getElementById('chatPopup').style.display = 'flex';
    startChatTimer();

    // Simulate deduction from the "non-accepting" player after timeout
    setTimeout(() => {
        alert("Other player didn't respond. ₹ deducted.");
        document.getElementById('chatPopup').style.display = 'none';
    }, 300000); // 5 mins
}

function sendChatMessage() {
    const msg = document.getElementById('chatInput').value.trim();
    if (msg) {
        const chatBox = document.getElementById('chatMessages');
        const msgElement = document.createElement('p');
        msgElement.innerHTML = `<strong>You:</strong> ${msg}`;
        chatBox.appendChild(msgElement);
        document.getElementById('chatInput').value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function startGame() {
    alert("Game Started! 🎮");
    clearInterval(chatTimerInterval);
    document.getElementById('chatPopup').style.display = 'none';
}

function startChatTimer() {
    clearInterval(chatTimerInterval);
    remainingSeconds = 300;

    chatTimerInterval = setInterval(() => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        document.getElementById('chatTimer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (remainingSeconds <= 0) {
            clearInterval(chatTimerInterval);
        }
        remainingSeconds--;
    }, 1000);
}
document.getElementById('createChallengeBtn').addEventListener('click', function () {
    const challengeBox = document.getElementById('createChallengeContainer');
    challengeBox.style.display = (challengeBox.style.display === 'none' || challengeBox.style.display === '') ? 'block' : 'none';
});