const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdImg = new Image();
birdImg.src = "b-removebg-preview.png";

let bird = { x: 50, y: 150, width: 40, height: 40, gravity: 0.6, lift: -10, velocity: 0 };

let gravity = 0.6;
let flap = -10;
let pipes = [];
let pipeWidth = 60;
let pipeGap = 140;
let frame = 0;
let score = 0;
let gameRunning = true;

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameRunning = true;
  document.getElementById("gameOver").style.display = "none";
  loop();
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "#0f0";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    let topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, top: topHeight, passed: false });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (
        bird.y < pipe.top ||
        bird.y + bird.height > pipe.top + pipeGap
      )
    ) {
      gameOver();
    }

    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function updateBird() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height >= canvas.height || bird.y < 0) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  document.getElementById("gameOver").style.display = "block";
}

function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  updateBird();
  updatePipes();

  frame++;
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", () => {
  bird.velocity = flap;
});
document.addEventListener("mousedown", () => {
  bird.velocity = flap;
});

document.getElementById("restart").addEventListener("click", resetGame);

loop();

document.addEventListener('deviceready', () => {
  if (typeof AdMob !== 'undefined') {
    AdMob.banner.config({
      id: 'ca-app-pub-8548359650840679/5405388810', // Replace with your AdMob ID
      isTesting: false, // Set false before publishing
      autoShow: false,
    });
    AdMob.banner.prepare();
  }
});

// Start the game
startGame();