const navLinks = document.querySelectorAll('.nav-bar a');
const contents = document.querySelectorAll('.content');
let walletAmount = 0;
let selectedMatchType = '';
let selectedPrize = null;

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
    const prize = parseInt(document.getElementById('customPrize').value);

    if (!selectedMatchType || isNaN(prize) || prize < 10 || prize % 5 !== 0) {
        alert("Please select a match type and valid prize amount (min ₹10, steps of 5)");
        return;
    }

    const challengeDiv = document.createElement('div');
    challengeDiv.className = 'challenge-block';
    challengeDiv.innerHTML = `
  <h4>${selectedMatchType} - ₹${selectedPrize}</h4>
  <p>Game: ${game}</p>
  <button onclick="enterChallenge('custom')">Enter</button>
  <button onclick="acceptChallenge(this)">Accept</button>
  <button onclick="shareChallenge()">Share</button>
`;
    document.getElementById('submittedChallenges').prepend(challengeDiv);

    // Reset
    selectedMatchType = '';
    document.getElementById('customPrize').value = 10;
    alert("Challenge created!");
}


function enterChallenge(type, btn) {
    const prizeInput = btn.parentElement.querySelector('.prizeInput');
    const prize = parseInt(prizeInput.value);
    if (isNaN(prize) || prize < 10 || prize % 5 !== 0) {
        alert("Please enter a valid prize amount (starting at ₹10, steps of 5)");
        return;
    }
    alert(`Entered ${type} with ₹${prize}`);
}
document.getElementById('proofForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const playerId = document.getElementById('playerId').value;
    const screenshotInput = document.getElementById('screenshot');
    const file = screenshotInput.files[0];

    if (!playerId || !file) {
        alert("Please fill in all fields.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const proofItem = document.createElement('div');
        proofItem.className = 'proof-entry';
        proofItem.innerHTML = `
                <p><strong>Player ID:</strong> ${playerId}</p>
                <img src="${e.target.result}" alt="Screenshot" width="200" />
                <hr />
              `;
        document.getElementById('proofList').prepend(proofItem);
    };
    reader.readAsDataURL(file);

    // Reset form
    this.reset();
});

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