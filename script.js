
let fill = 90;
let hunger = 100;
let intervalId = null;
let scoreIntervalId = null;
let hungerIntervalId = null;
let score = 0;
let isGameOver = false;

const fishbowl = document.getElementById('fishbowl');
const fish = document.getElementById('fish');
const tap = document.getElementById('tap');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const hungerFillEl = document.getElementById('hunger-fill');
const feedBtn = document.getElementById('feed-btn');
// Fix selector to target the Game Over screen specifically, not Start Screen
const gameOverMsg = document.querySelector('#game-over .game-over__content p');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

// WIN CONDITION
const WIN_SCORE = 60; // Survive 60 seconds to win

const updateScore = () => {
	if (!isGameOver) {
		score++;
		scoreEl.innerText = `Time: ${score}s`;

		if (score >= WIN_SCORE) {
			winGame();
		}
	}
};

const winGame = () => {
	clearInterval(intervalId);
	clearInterval(scoreIntervalId);
	clearInterval(hungerIntervalId);
	isGameOver = true;

	// Happy Fish Animation
	fish.classList.remove('fishbowl__fish--dying');
	fish.classList.remove('fishbowl__fish--dead');
	fish.style.animation = 'swimming 2s infinite ease-in-out';

	// Stop Music on Win
	bgMusic.pause();
	isMusicPlaying = false;
	musicBtn.innerText = '🔇';

	// Victory Message
	gameOverMsg.innerHTML = `You Saved Nemo!<br>Score: ${score}s<br>The water has stopped draining.`;
	const winTitle = document.querySelector('#game-over h2');
	winTitle.innerText = "YOU WON!";
	winTitle.style.color = "#2ecc71"; // Green for win
	gameOverEl.classList.add('won'); // Add won class for styling
	gameOverEl.classList.remove('hidden');

	fishbowl.classList.add('fishbowl--won'); // Hide external water

	// Confetti effect (simulated with bubbles for now)
	for (let i = 0; i < 20; i++) setTimeout(createBubble, i * 100);
};

const updateHunger = () => {
	if (isGameOver) return;

	hunger = Math.max(0, hunger - 1);
	hungerFillEl.style.width = `${hunger}%`;

	// Change color based on hunger level
	if (hunger < 20) {
		hungerFillEl.style.background = '#ff0000'; // Red critical
	} else if (hunger < 50) {
		hungerFillEl.style.background = '#ffa500'; // Orange warning
	} else {
		hungerFillEl.style.background = '#ff6600'; // Normal
	}

	if (hunger <= 0) {
		killFish("starved");
	}
};

const emptyingFn = () => setInterval(() => {
	if (isGameOver) return;

	fill = fill - 1;
	fishbowl.style = `--filling: ${fill}`;

	if (fill <= 0) {
		killFish("dried");
	} else if (fill < 20) {
		fish.classList.add('fishbowl__fish--dead');
	} else if (fill < 50) {
		fish.classList.add('fishbowl__fish--dying');
	} else {
		fish.classList.remove('fishbowl__fish--dying');
		fish.classList.remove('fishbowl__fish--dead');
	}
}, 75);

const killFish = (reason) => {
	clearInterval(intervalId);
	clearInterval(scoreIntervalId);
	clearInterval(hungerIntervalId);
	isGameOver = true;

	// Conditionally apply death animation
	if (reason === "starved") {
		fish.classList.add('fishbowl__fish--dead');
	} else {
		fish.classList.add('fishbowl__fish--floating');
	}

	let message = `You kept the fish alive for <span id="final-score">${score}</span> seconds.`;
	if (reason === "starved") {
		message += "<br>The fish starved to death!";
	} else if (reason === "dried") {
		message += "<br>The water ran out!";
	}

	gameOverMsg.innerHTML = message;
	gameOverEl.classList.remove('hidden');
};

const startGame = () => {
	isGameOver = false;
	fill = 90;
	hunger = 100;
	score = 0;
	scoreEl.innerText = `Time: 0s`;
	gameOverEl.classList.add('hidden');
	hungerFillEl.style.width = '100%';
	hungerFillEl.style.background = '#ff6600';

	// Reset classes
	fish.classList.remove('fishbowl__fish--dying');
	fish.classList.remove('fishbowl__fish--dead');
	fish.classList.remove('fishbowl__fish--floating');

	// Start intervals
	if (intervalId) clearInterval(intervalId);
	if (scoreIntervalId) clearInterval(scoreIntervalId);
	if (hungerIntervalId) clearInterval(hungerIntervalId);

	intervalId = emptyingFn();
	scoreIntervalId = setInterval(updateScore, 1000);
	hungerIntervalId = setInterval(updateHunger, 80); // Hunger decreases faster than water
};

// Initial Start
// startGame();

tap.addEventListener('click', () => {
	if (isGameOver) return;
	tap.classList.add('fishbowl__tap--active');
	setTimeout(() => tap.classList.remove('fishbowl__tap--active'), 500);
	fill = Math.min(fill + 10, 90);
	if (fill > 20) fish.classList.remove('fishbowl__fish--dead');
	if (fill > 50) fish.classList.remove('fishbowl__fish--dying');
});

feedBtn.addEventListener('click', () => {
	if (isGameOver) return;

	// Feed logic
	hunger = Math.min(hunger + 5, 100);
	updateHunger(); // Apply immediate visual update

	// Visual effect: Drop food
	const flake = document.createElement('div');
	flake.classList.add('food-flake');
	flake.style.left = `${Math.random() * 40 + 30}%`; // Fall near center
	document.querySelector('.fishbowl__water').appendChild(flake);

	setTimeout(() => flake.remove(), 2000);
});

restartBtn.addEventListener('click', startGame);

// Bubble Logic
const water = document.querySelector('.fishbowl__water');
const createBubble = () => {
	if (isGameOver) return;
	const bubble = document.createElement('div');
	bubble.classList.add('bubble');
	bubble.style.left = `${Math.random() * 80 + 10}%`;
	const scale = Math.random() * 0.5 + 0.5;
	bubble.style.transform = `scale(${scale})`;
	water.appendChild(bubble);
	setTimeout(() => bubble.remove(), 3000);
};
setInterval(createBubble, 800);

// Background Music Logic
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isMusicPlaying = false;

bgMusic.volume = 0.5;

// (Auto-play logic removed in favor of Start Screen)

musicBtn.addEventListener('click', () => {
	if (isMusicPlaying) {
		bgMusic.pause();
		musicBtn.innerText = '🔇';
		isMusicPlaying = false;
	} else {
		bgMusic.play().catch(e => console.log("Audio play failed:", e));
		musicBtn.innerText = '🔊';
		isMusicPlaying = true;
	}
});

// Start Screen Logic
startBtn.addEventListener('click', () => {
	startScreen.classList.add('hidden');
	bgMusic.play().then(() => {
		musicBtn.innerText = '🔊';
		isMusicPlaying = true;
	}).catch(e => console.log("Audio play failed:", e));

	startGame();
});

// Remove immediate start
// startGame();