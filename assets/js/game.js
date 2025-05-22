// import 문 제거 (필요한 경우 올바른 import 문 추가)

const startScreen = document.getElementById("start-screen");        // 시작 화면
const gameScreen = document.getElementById("game-screen");          // 게임 화면
const startButton = document.getElementById("start-button");        // 게임 시작 버튼
const giveUpButton = document.getElementById("give-up-button");     // 게임 포기 버튼
const gameBoard = document.getElementById("game");                  // 게임 보드
const timerDisplay = document.getElementById("timer");              // 타이머 표시
const scoreDisplay = document.getElementById("score");              // 점수 표시
const messageDisplay = document.getElementById("message");          // 메시지 표시
const highScoreDisplay = document.getElementById("high-score");     // 최고 점수 표시
const currentPointDisplay = document.getElementById("current-point"); // 현재 보유 포인트 표시
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
const symbolsColor = [
    "#e37070",
    "#92564a",
    "#ffe681",
    "#ffb700",
    "#fca311",
    "#a97157",
    "#ebc349",
    "#eed2ff",
    "#8e7dbe",
    "#ecf39e",
    "#e0b1cb",
    "#a7c957",
    "#004e98",
    "#9bb053",
    "#3c713b",
    "#f8cb5c"
];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let gameStarted = false;
let timer;
let timeLeft = 30;
let score = 0;
let currentStage = 1;

const totalStages = 5;
let userPoint = getPoint().point;
let userName = getPoint().name;
let maxClearedStage = getPoint().maxClearedStage;

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

    // 화면 크기에 따른 카드 크기 조정
    const screenWidth = window.innerWidth;
    let cardWidth, cardHeight, gap;
    if (screenWidth <= 480) {
        cardWidth = 8; // 80px 
        cardHeight = 13; // 100px 
    } else if (screenWidth <= 768) {
        cardWidth = 11; // 100px 
        cardHeight = 18; // 130px 
    } else {
        cardWidth = 15; // 110px 
        cardHeight = 21; // 180px 
    }
    gap = 2; // 0.4rem = 4px

    // 게임 보드 스타일 설정
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, ${cardWidth}rem)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, ${cardHeight}rem)`;
    gameBoard.style.gap = `${gap}rem`;
    gameBoard.style.padding = `${gap}rem`;
    gameBoard.style.width = 'fit-content';
    gameBoard.style.margin = '0 auto';
    gameBoard.style.justifyContent = 'center';
    gameBoard.style.alignItems = 'center';

    cards.forEach((symbol, index) => {
        const card = document.createElement("div");
        card.classList.add("game-card");
        card.dataset.symbol = symbol;
        card.dataset.index = index;

        const front = document.createElement("div");
        const symbolIndex = symbols.indexOf(symbol);
        front.className = "game-card-front";
        front.style.backgroundImage = `url('${symbol}')`;
        front.style.backgroundSize = '75% 75%, cover';
        front.style.backgroundPosition = 'center, center';
        front.style.backgroundRepeat = 'no-repeat, no-repeat';
        front.style.backgroundColor = symbolsColor[symbolIndex]

        const back = document.createElement("div");
        back.className = "game-card-back";
        back.style.backgroundImage = "url('../../assets/imgs/img/h_logo.png')";
        back.style.backgroundSize = '65% 65%';
        back.style.backgroundPosition = 'center';
        back.style.backgroundRepeat = 'no-repeat';
        back.style.backgroundColor = 'var(--bg-root)';
        
        card.appendChild(front);
        card.appendChild(back);
        gameBoard.appendChild(card);
    });
}

function startGame() {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    currentStage = 1;
    score = 0;
    currentPointDisplay.textContent = userPoint;
    scoreDisplay.textContent = `${userName}님의 점수: ${score}`;
    messageDisplay.textContent = `스테이지 ${currentStage}`;

    // 3초 동안 모두 뒤집기
    document.querySelectorAll('.game-card').forEach(card => card.classList.add('flipped'));
    setTimeout(() => {
        document.querySelectorAll(".game-card").forEach(card => {
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
    document.querySelectorAll('.game-card').forEach(card => card.classList.add('flipped'));
    setTimeout(() => {
        document.querySelectorAll(".game-card").forEach(card => {
            card.classList.remove("flipped");
        });
        gameStarted = true;
        startTimer();
    }, 3000);
}

async function giveUp() {
    if (confirm(`${userName}님, 게임을 포기하시겠습니까?\n현재까지 획득한 ${score}점을 잃게 됩니다.\n현재 포인트: ${userPoint}점`)) {
        clearInterval(timer);
        messageDisplay.textContent = `게임 포기! 현재 점수 ${score}점을 잃었습니다.`;
        score=0;
        
        setTimeout(async () => {
            await resetGame();
        }, 2000);
    }
}

async function endGame(success) {
    gameStarted = false;
    document.querySelectorAll(".game-card").forEach(card => {
        card.style.pointerEvents = "none";
    });

    if (success) {
        if (currentStage === totalStages) {
            score += 10000;
            scoreDisplay.textContent = `점수: ${score}`;
            currentPointDisplay.textContent = userPoint + score;
            messageDisplay.textContent = `축하합니다! ${userName}님 모든 스테이지를 클리어했습니다!`;
            console.log(`게임 클리어! 최종 점수: ${score}`);
            
            await sendPoint(currentStage);
            console.log(`${userName}님의 현재 포인트: ${userPoint + score}`);
            
        } else {
            score += 400;
            scoreDisplay.textContent = `${userName}님의 점수: ${score}`;
            messageDisplay.textContent = `스테이지 ${currentStage} 클리어! +400점 획득!`;
            console.log(`스테이지 ${currentStage} 클리어! 현재 점수: ${score}`);
            onStageClear(score);
            return;
        }
    } else {
        messageDisplay.textContent = `시간 초과! 다시 도전해보세요!<br> 최종 점수: ${score}`;
        score = 0;
    }

    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    
    setTimeout(async () => {
        await resetGame();
    }, 2000);
}

async function resetGame() {
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
    
    // 사용자 정보 새로 불러오기
    try {
        const userData = await getPoint();
        if (userData) {
            userPoint = userData.point;
            userName = userData.name;
            maxClearedStage = userData.maxClearedStage;
            
            document.getElementById('current-point').textContent = userPoint;
            document.getElementById('high-score').textContent = maxClearedStage;
        }
    } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
    }
    
    messageDisplay.textContent = "";
}

gameBoard.addEventListener("click", e => {
    if (!gameStarted) return;
    const clicked = e.target.closest(".game-card");
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
    createBoard();
    startGame();
});

// 게임 포기 버튼 이벤트 리스너
giveUpButton.addEventListener("click", giveUp);

// 화면 크기 변경 이벤트 리스너 추가
window.addEventListener('resize', () => {
    if (gameStarted) {
        createBoard();
    }
});

// 스테이지 클리어 시 호출
async function onStageClear(currentScore) {
    document.getElementById('stage-clear-score').textContent = currentScore;
    document.getElementById('stage-clear-modal').style.display = 'flex';
}

// "도전하기" 버튼 클릭 시
document.getElementById('next-stage-btn').onclick = function() {
    document.getElementById('stage-clear-modal').style.display = 'none';
    nextStage();
};

// "종료하기" 버튼 클릭 시
document.getElementById('end-game-btn').onclick = async function() {
    document.getElementById('stage-clear-modal').style.display = 'none';
    await sendPoint(currentStage);
    gameScreen.style.display = "none";
    startScreen.style.display = "block";
    await resetGame();
};

// 전역 스코프의 await 코드를 즉시 실행 함수로 감싸기
async function sendPoint(currentStage) {
    try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
        if (!token) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch("/game/point", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // 인증 토큰 추가
            },
            body: JSON.stringify({ stage: currentStage }),
        });

        const result = await response.json();
        console.log("서버 응답:", result);

        if (!response.ok) {
            throw new Error(result.message || "포인트 전송에 실패했습니다.");
        }
    } catch (err) {
        console.error("에러 발생:", err);
        alert(err.message);
    }
}

async function getPoint() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch("/game/getpoint", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('포인트 조회에 실패했습니다.');
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("에러 발생:", err);
        return { name: '게스트', point: 0 };
    }
}

// 게임 시작 시 포인트 조회
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userData = await getPoint();
        if (userData) {
            userName = userData.name;
            userPoint = userData.point;
            
            document.getElementById('user-name').textContent = userName;
            document.getElementById('user-name-start').textContent = userName;
            document.getElementById('current-point').textContent = userPoint;
            document.getElementById('high-score').textContent = userData.maxClearedStage;
        }
    } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
    }
});
