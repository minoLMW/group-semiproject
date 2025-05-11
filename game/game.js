const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const iceCreamWidth = 40;
const iceCreamHeight = 30;
const normalGravity = 1;
const fastGravity = 5; // 아래 방향키로 빠르게 내려올 때 적용할 중력
const moveSpeed = 5;
const shapes = ['rectangle', 'circle', 'triangle']; // 가능한 모양들

let currentIceCream = null;
let stackedIceCreams = [];
let score = 0;
let gameInterval;
let currentVerticalSpeed = normalGravity; // 현재 수직 이동 속도

function createIceCream() {
    const x = Math.random() * (canvas.width - iceCreamWidth);
    const y = 0;
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return { x, y, width: iceCreamWidth, height: iceCreamHeight, color, shape };
}

function drawIceCream(iceCream) {
    ctx.fillStyle = iceCream.color;
    ctx.strokeStyle = 'black';

    switch (iceCream.shape) {
        case 'rectangle':
            ctx.fillRect(iceCream.x, iceCream.y, iceCream.width, iceCream.height);
            ctx.strokeRect(iceCream.x, iceCream.y, iceCream.width, iceCream.height);
            break;
        case 'circle':
            ctx.beginPath();
            ctx.arc(iceCream.x + iceCream.width / 2, iceCream.y + iceCream.height / 2, iceCream.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(iceCream.x + iceCream.width / 2, iceCream.y);
            ctx.lineTo(iceCream.x, iceCream.y + iceCream.height);
            ctxlineTo(iceCream.x + iceCream.width, iceCream.y + iceCream.height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 쌓인 아이스크림 그리기
    stackedIceCreams.forEach(drawIceCream);

    if (currentIceCream) {
        currentIceCream.y += currentVerticalSpeed; // 현재 수직 속도 적용
        drawIceCream(currentIceCream);

        // 바닥 충돌
        if (currentIceCream.y + currentIceCream.height > canvas.height) {
            stackIceCream();
            currentVerticalSpeed = normalGravity; // 충돌 후 속도 초기화
        } else {
            // 다른 아이스크림과 충돌 검사
            for (const stacked of stackedIceCreams) {
                if (isColliding(currentIceCream, stacked)) {
                    stackIceCream();
                    currentVerticalSpeed = normalGravity; // 충돌 후 속도 초기화
                    break;
                }
            }
        }

        // 게임 오버 검사 (쓰러짐)
        if (stackedIceCreams.some(iceCream => iceCream.y < 0)) {
            gameOver();
        }
    } else {
        currentIceCream = createIceCream();
        currentVerticalSpeed = normalGravity; // 새로운 아이스크림 생성 시 속도 초기화
    }

    scoreDisplay.textContent = `점수: ${score}`;
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function stackIceCream() {
    stackedIceCreams.push({...currentIceCream});
    currentIceCream = null;
    score++;

    // 게임 오버 검사 (다른 곳에 쌓임)
    if (stackedIceCreams.length > 1) {
        const last = stackedIceCreams[stackedIceCreams.length - 1];
        const secondLast = stackedIceCreams[stackedIceCreams.length - 2];
        if (Math.abs(last.x - secondLast.x) > iceCreamWidth / 2) {
            gameOver();
        }
    }
}

function moveLeft() {
    if (currentIceCream) {
        currentIceCream.x -= moveSpeed;
        if (currentIceCream.x < 0) {
            currentIceCream.x = 0;
        }
    }
}

function moveRight() {
    if (currentIceCream) {
        currentIceCream.x += moveSpeed;
        if (currentIceCream.x + currentIceCream.width > canvas.width) {
            currentIceCream.x = canvas.width - currentIceCream.width;
        }
    }
}

function dropIceCream() {
    if (currentIceCream) {
        while (currentIceCream.y + currentIceCream.height < canvas.height) {
            let collision = false;
            for (const stacked of stackedIceCreams) {
                if (isColliding(currentIceCream, stacked)) {
                    collision = true;
                    break;
                }
            }
            if (collision) {
                currentIceCream.y -= normalGravity; // 충돌 직전 위치로 되돌림
                break;
            }
            currentIceCream.y += normalGravity;
        }
        stackIceCream();
        currentVerticalSpeed = normalGravity; // 낙하 후 속도 초기화
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert(`게임 오버! 최종 점수: ${score}`);
    stackedIceCreams = [];
    score = 0;
    startGame();
}

function startGame() {
    gameInterval = setInterval(gameLoop, 30);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
    } else if (e.key === 'ArrowDown') {
        currentVerticalSpeed = fastGravity;
    } else if (e.key === ' ') {
        dropIceCream();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown') {
        currentVerticalSpeed = normalGravity; // 아래 방향키에서 손을 떼면 기본 속도로 변경
    }
});

startGame();