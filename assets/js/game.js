const startScreen = document.getElementById("start-screen");        // 시작 화면
const gameScreen = document.getElementById("game-screen");          // 게임 화면
const startButton = document.getElementById("start-button");        // 게임 시작 버튼
const giveUpButton = document.getElementById("give-up-button");     // 게임 포기 버튼
const gameBoard = document.getElementById("game");                  // 게임 보드
const timerDisplay = document.getElementById("timer");              // 타이머 표시
const scoreDisplay = document.getElementById("score");              // 점수 표시
const messageDisplay = document.getElementById("message");          // 메시지 표시
const highScoreDisplay = document.getElementById("high-score");     // 최고 점수 표시

const symbols = [
    "https://www.baskinrobbins.co.kr/upload/product/main/df8edecf77ec6f9869758e40cdced484.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/ce2877eeb77d7ab5abaf74c62968a6d3.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/5544365d5b0674ec59211e48a1014472.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/fd1b61565b616ae04864840360b7cd9d.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/86b27ac5d1c957f087fedf5b85112ec6.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/6b7de3ba55a71e3e99dc341d5cb908a9.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/bce95152aa2cdef66dd35f8bd232c859.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/62f1f363048e043f75a6ee14cb38e2e7.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/a8ab3cb918353a71c352281b4500109e.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/aa02f4ff308947b372036aceec15d00d.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/7f981fc6e7a526daee600f4cee803b43.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/5a245ce198acfaaff602d6e2eab84341.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/719e8584fd50151284b5ace3589f7a34.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/eec8cef386cf6697768a89b384c07bf7.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/e72e22d7c61114e415411c311ee052bd.png",
    "https://www.baskinrobbins.co.kr/upload/product/main/91c8668227bcf556c43a968b97e342e6.png"
];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let gameStarted = false;
let timer;
let timeLeft = 30;
let score = 0;
let currentStage = 1;
let highScore = localStorage.getItem('highScore') || 0;
const totalStages = 5;

// 최고 점수 표시 업데이트
highScoreDisplay.textContent = highScore;

// 스테이지별 설정 (카드 쌍 수와 제한 시간)
const stageSettings = {
    1: { pairs: 2, time: 30 },  // 4장 (2쌍) - 30초
    2: { pairs: 4, time: 30 },  // 8장 (4쌍) - 30초
    3: { pairs: 6, time: 30 },  // 12장 (6쌍) - 30초
    4: { pairs: 8, time: 30 },  // 16장 (8쌍) - 30초
    5: { pairs: 10, time: 30 }  // 20장 (10쌍) - 30초
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    // 게임 보드를 초기화하고, 현재 스테이지에 맞는 카드 쌍을 생성합니다.
    gameBoard.innerHTML = "";
    const pairs = stageSettings[currentStage].pairs;
    const stageSymbols = symbols.slice(0, pairs);
    cards = [...stageSymbols, ...stageSymbols];
    shuffle(cards);

    // 카드 수에 따른 그리드 레이아웃 계산
    let rows, cols;
    switch(currentStage) {
        case 1: rows = 2; cols = 2; break;
        case 2: rows = 2; cols = 4; break;
        case 3: rows = 3; cols = 4; break;
        case 4: rows = 4; cols = 4; break;
        case 5: rows = 4; cols = 5; break;
    }

    // 게임 보드 스타일 설정
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 131.25px)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 170.625px)`;
    gameBoard.style.gap = '15px';
    gameBoard.style.padding = '15px';
    gameBoard.style.width = 'fit-content';
    gameBoard.style.margin = '0 auto';
    gameBoard.style.justifyContent = 'center';
    gameBoard.style.alignItems = 'center';

    cards.forEach((symbol, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.dataset.index = index;

        const front = document.createElement("div");
        front.className = "card-front";
        front.style.backgroundImage = `url('${symbol}'), url('../../assets/imgs/img/h_logo_2.png')`;
        front.style.backgroundSize = '75% 75%, cover';
        front.style.backgroundPosition = 'center, center';
        front.style.backgroundRepeat = 'no-repeat, no-repeat';

        const back = document.createElement("div");
        back.className = "card-back";
        back.style.backgroundImage = "url('../../assets/imgs/img/h_logo.png')";
        back.style.backgroundSize = '65% 65%';
        back.style.backgroundPosition = 'center';
        back.style.backgroundRepeat = 'no-repeat';
        
        card.appendChild(front);
        card.appendChild(back);
        gameBoard.appendChild(card);
    });
}

function startGame() {
    // 게임을 시작할 때 초기화 작업을 수행하고, 3초 동안 모든 카드를 공개합니다.
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    currentStage = 1;
    score = 0;
    scoreDisplay.textContent = `점수: ${score}`;
    messageDisplay.textContent = `스테이지 ${currentStage}`;

    // 3초 동안 모두 뒤집기
    document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
    setTimeout(() => {
        document.querySelectorAll(".card").forEach(card => {
            card.classList.remove("flipped");
        });
        gameStarted = true;
        startTimer();
    }, 3000);
}

function startTimer() {
    // 남은 시간을 1초마다 갱신하며, 시간이 다 되면 게임을 종료합니다.
    timeLeft = stageSettings[currentStage].time;
    timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `남은 시간: ${timeLeft}초`;

        if (timeLeft === 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function nextStage() {
    // 다음 스테이지로 넘어갈 때 보드와 상태를 초기화하고, 3초 동안 카드를 공개합니다.
    currentStage++;
    if (currentStage > totalStages) {
        endGame(true);
        return;
    }
    gameStarted = false;
    flippedCards = [];
    matchedCount = 0;
    messageDisplay.textContent = `스테이지 ${currentStage}`;
    createBoard();
    document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
    setTimeout(() => {
        document.querySelectorAll(".card").forEach(card => {
            card.classList.remove("flipped");
        });
        gameStarted = true;
        startTimer();
    }, 3000);
}

function giveUp() {
    // 사용자가 게임을 포기할 때 점수를 잃고 게임을 초기화합니다.
    if (confirm("게임을 포기하시겠습니까?\n현재까지 획득한 점수를 잃게 됩니다.")) {
        clearInterval(timer);
        messageDisplay.textContent = `게임 포기! 현재 점수 ${score}점을 잃었습니다.`;
        setTimeout(() => {
            resetGame();
        }, 2000);
    }
}

function updateHighScore() {
    // 최고 점수를 갱신하고, localStorage에 저장합니다.
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = highScore;
    }
}


function endGame(success) {
	// 스테이지 클리어 또는 실패 시 게임을 종료하고, 메시지와 점수를 처리합니다.
	gameStarted = false;
	document.querySelectorAll(".card").forEach(card => {
		card.style.pointerEvents = "none";
	});

	if (success) {
		if (currentStage === totalStages) {
			score += 100;
			scoreDisplay.textContent = `점수: ${score}`;
			messageDisplay.textContent = "🎉 축하합니다! 모든 스테이지를 클리어했습니다!";
			console.log(`게임 클리어! 최종 점수: ${score}점`); // 콘솔에 점수 표시
			updateHighScore();
		} else {
			score += 100;
			scoreDisplay.textContent = `점수: ${score}`;
			messageDisplay.textContent = `스테이지 ${currentStage} 클리어! +100점 획득! 다음 스테이지로...`;
			console.log(`스테이지 ${currentStage} 클리어! 현재 점수: ${score}점`); // 콘솔에 점수 표시
			setTimeout(() => {
				nextStage();
			}, 2000);
			return;
		}
	} else {
		messageDisplay.textContent = "⏰ 시간 초과! 다시 도전해보세요!";
		console.log(`게임 오버! 최종 점수: ${score}점`); // 콘솔에 점수 표시
	}

	setTimeout(() => {
		resetGame();
	}, 3000);
}

function resetGame() {
    // 게임을 완전히 초기화하여 처음 상태로 되돌립니다.
    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedCount = 0;
    currentStage = 1;
    score = 0;
    gameStarted = false;
    
    gameScreen.style.display = "none";
    startScreen.style.display = "block";
    
    clearInterval(timer);
    timerDisplay.textContent = `남은 시간: ${stageSettings[currentStage].time}초`;
    scoreDisplay.textContent = `점수: ${score}`;
    messageDisplay.textContent = "";
}

gameBoard.addEventListener("click", e => {
    // 카드 클릭 시 뒤집기, 매칭 검사, 성공/실패 처리 등 게임의 핵심 로직을 담당합니다.
    if (!gameStarted) return;
    const clicked = e.target.closest(".card");
    if (!clicked || clicked.classList.contains("flipped") || flippedCards.length >= 2) return;

    clicked.classList.add("flipped");
    flippedCards.push(clicked);

    if (flippedCards.length === 2) {
        const [first, second] = flippedCards;
        if (first.dataset.symbol === second.dataset.symbol) {
            first.classList.add("matched");
            second.classList.add("matched");
            matchedCount++;
            flippedCards = [];

            if (matchedCount === stageSettings[currentStage].pairs) {
                clearInterval(timer);
                endGame(true);
            }
        } else {
            setTimeout(() => {
                first.classList.remove("flipped");
                second.classList.remove("flipped");
                flippedCards = [];
            }, 800);
        }
    }
});

// 게임 시작 버튼 이벤트 리스너
startButton.addEventListener("click", () => {
    // 게임 보드를 생성하고 게임을 시작합니다.
    createBoard();
    startGame();
});

// 게임 포기 버튼 이벤트 리스너
giveUpButton.addEventListener("click", giveUp);