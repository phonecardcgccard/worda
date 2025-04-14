// 添加游戏配置对象
const gameConfig = {
    maxWords: 20,
    difficulties: {
        easy: { timeLimit: 120000, scoreMultiplier: 1 },
        normal: { timeLimit: 90000, scoreMultiplier: 1.5 },
        hard: { timeLimit: 60000, scoreMultiplier: 2 }
    },
    bonusPoints: {
        combo: 5,
        timeBonus: 10
    }
};

// 改进游戏状态管理
const gameState = {
    // ... 现有状态 ...
    combo: 0,
    maxCombo: 0,
    lastMatchTime: 0,
    statistics: {
        totalGames: 0,
        bestScore: 0,
        averageTime: 0
    }
};

// 添加游戏统计功能
function updateStatistics() {
    const stats = gameState.statistics;
    stats.totalGames++;
    stats.bestScore = Math.max(stats.bestScore, gameState.score);
    localStorage.setItem('gameStats', JSON.stringify(stats));
}

// 改进计分系统
function updateScore(points) {
    if (points > 0) {
        gameState.combo++;
        const comboBonus = Math.floor(gameState.combo / 3) * gameConfig.bonusPoints.combo;
        points += comboBonus;
        
        const now = Date.now();
        if (gameState.lastMatchTime && (now - gameState.lastMatchTime < 2000)) {
            points += gameConfig.bonusPoints.timeBonus;
        }
        gameState.lastMatchTime = now;
    } else {
        gameState.combo = 0;
    }
    
    gameState.score += points;
    updateUI();
}
// 添加防抖函数
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 优化画布渲染
function drawConnection() {
    const canvas = elements.connectionCanvas;
    const ctx = canvas.getContext('2d');
    
    // 使用 requestAnimationFrame 优化动画
    if (!gameState.animationFrame) {
        gameState.animationFrame = requestAnimationFrame(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnections();
            gameState.animationFrame = null;
        });
    }
}

// 优化事件监听
window.addEventListener('resize', debounce(initCanvas, 250));

// 添加进度保存功能
function saveProgress() {
    const progress = {
        score: gameState.score,
        matchedPairs: gameState.matchedPairs,
        mistakes: gameState.mistakes,
        timeRemaining: gameState.timeLimit
    };
    localStorage.setItem('gameProgress', JSON.stringify(progress));
}

// 添加游戏暂停功能
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    if (gameState.isPaused) {
        clearInterval(gameState.timer);
        showPauseOverlay();
    } else {
        startTimer();
        hidePauseOverlay();
    }
}

// 改进错误提示
function showFriendlyError(message, duration = 3000) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-toast';
    errorContainer.textContent = message;
    document.body.appendChild(errorContainer);
    
    setTimeout(() => {
        errorContainer.classList.add('fade-out');
        setTimeout(() => errorContainer.remove(), 300);
    }, duration);
}

// 添加触摸事件支持
function setupTouchEvents(card) {
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd);
}

// 处理触摸开始
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    gameState.dragStartPos = {
        x: touch.clientX,
        y: touch.clientY
    };
}

// 处理触摸移动
function handleTouchMove(e) {
    e.preventDefault();
    if (!gameState.isDragging) return;
    
    const touch = e.touches[0];
    gameState.dragEndPos = {
        x: touch.clientX,
        y: touch.clientY
    };
    drawConnection();
}

// 添加视口调整函数
function adjustViewport() {
    const gameContainer = document.querySelector('.game-container');
    const windowHeight = window.innerHeight;
    const containerHeight = gameContainer.offsetHeight;
    
    if (containerHeight > windowHeight) {
        gameContainer.style.height = `${windowHeight - 40}px`;
        gameContainer.style.overflow = 'auto';
    }
}

// 改进初始化画布函数
function initCanvas() {
    const canvas = elements.connectionCanvas;
    const container = document.querySelector('.word-columns');
    if (canvas && container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.pointerEvents = 'none';
    }
}

// 改进渲染单词卡片函数
function renderWordCards() {
    elements.englishWords.innerHTML = '';
    elements.chineseWords.innerHTML = '';
    
    const cardHeight = Math.floor(100 / Math.min(gameState.words.length, 8)) + 'vh';
    
    gameState.words.forEach((word, index) => {
        const englishCard = createWordCard(word.english, 'english', word);
        const chineseCard = createWordCard(word.chinese, 'chinese', word);
        
        englishCard.style.height = cardHeight;
        chineseCard.style.height = cardHeight;
        
        elements.englishWords.appendChild(englishCard);
        elements.chineseWords.appendChild(chineseCard);
    });
}

// 添加窗口大小变化监听
window.addEventListener('resize', () => {
    adjustViewport();
    initCanvas();
});

// 在初始化游戏时调用视口调整
function initGame() {
    // ... 现有代码 ...
    adjustViewport();
    initCanvas();
    renderWordCards();
    // ... 现有代码 ...
}




