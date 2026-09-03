const puzzles = {
    characters: [
        { word: 'MOSES', jumble: 'SOSEM', clue: 'He led the Israelites out of Egypt.' },
        { word: 'DAVID', jumble: 'VAIDD', clue: 'He defeated Goliath with a sling and a stone.' },
        { word: 'JONAH', jumble: 'HANOJ', clue: 'He was swallowed by a great fish.' },
        { word: 'ESTHER', jumble: 'HETRES', clue: 'She became queen and saved her people.' },
        { word: 'RUTH', jumble: 'HURT', clue: 'She stayed loyal to Naomi.' },
        { word: 'ELIJAH', jumble: 'JHLAEI', clue: 'He was a prophet taken up to heaven in a whirlwind.' },
        { word: 'DANIEL', jumble: 'LNAIDE', clue: "He was thrown into the lions' den." },
        { word: 'JOHN', jumble: 'HNAOJ', clue: 'He baptized Jesus.' },
        { word: 'PAUL', jumble: 'LPAU', clue: 'He wrote many letters in the New Testament.' },
        { word: 'JOSEPH', jumble: 'SHEPJO', clue: 'His brothers sold him, but he became a leader in Egypt.' }
    ],
    books: [
        { word: 'GENESIS', jumble: 'SISENGE', clue: 'The first book of the Bible; it tells about Creation.' },
        { word: 'EXODUS', jumble: 'SOXUDE', clue: 'This book tells how the Israelites left Egypt.' },
        { word: 'MATTHEW', jumble: 'TTHMAWE', clue: 'The first book of the New Testament.' },
        { word: 'MARK', jumble: 'KRAM', clue: 'The shortest Gospel.' },
        { word: 'LUKE', jumble: 'KEUL', clue: 'This Gospel was written by a doctor.' },
        { word: 'JOHN', jumble: 'HNOJ', clue: 'This Gospel says, "For God so loved the world..."' },
        { word: 'ACTS', jumble: 'STCA', clue: 'This book tells about the beginning of the early church.' },
        { word: 'PSALMS', jumble: 'SMLASP', clue: 'A book filled with songs, prayers, and praises.' },
        { word: 'PROVERBS', jumble: 'SVERPBRO', clue: 'A book full of wisdom, mostly connected to Solomon.' },
        { word: 'ROMANS', jumble: 'SMARNO', clue: 'This book teaches about salvation through faith in Jesus.' }
    ]
};

const state = {
    category: 'characters',
    index: 0,
    solved: new Set(),
    score: 0,
    streak: 0,
    hintUsed: false,
    randomMode: false,
    timeLeft: 10,
    timerId: null,
    advanceId: null,
    currentItems: []
};

const el = {
    score: document.getElementById('score'),
    solved: document.getElementById('solved'),
    total: document.getElementById('total'),
    streak: document.getElementById('streak'),
    categoryLabel: document.getElementById('categoryLabel'),
    progressLabel: document.getElementById('progressLabel'),
    timer: document.getElementById('timer'),
    timerBadge: document.querySelector('.question-timer'),
    jumbleLabel: document.getElementById('jumbleLabel'),
    jumbleWord: document.getElementById('jumbleWord'),
    hintBtn: document.getElementById('hintBtn'),
    skipBtn: document.getElementById('skipBtn'),
    nextBtn: document.getElementById('nextBtn'),
    randomBtn: document.getElementById('randomBtn'),
    message: document.getElementById('message'),
    answerReveal: document.getElementById('answerReveal'),
    modeBtns: document.querySelectorAll('.mode-btn[data-category]')
};

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function setItems() {
    if (state.randomMode || state.category === 'identification') {
        state.currentItems = shuffle([...puzzles.characters, ...puzzles.books].map((item, i) => ({
            ...item,
            id: `${item.word}-${i}`
        })));
    } else {
        state.currentItems = puzzles[state.category].map((item, i) => ({
            ...item,
            id: `${state.category}-${i}`
        }));
    }
    state.index = 0;
    state.solved = new Set();
    state.score = 0;
    state.streak = 0;
    state.hintUsed = false;
    el.total.textContent = state.currentItems.length;
}

function currentItem() {
    return state.currentItems[state.index];
}

function updateStats() {
    el.score.textContent = state.score;
    el.solved.textContent = state.solved.size;
    el.streak.textContent = state.streak;
}

function updateModeButtons() {
    el.modeBtns.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.category === state.category && !state.randomMode);
    });
}

function showCurrentPuzzle() {
    const item = currentItem();
    if (!item) return;

    el.jumbleLabel.textContent = 'Question';
    el.jumbleWord.textContent = item.clue;
    el.jumbleWord.classList.add('question-display');
    el.categoryLabel.textContent = state.randomMode ? 'Random Mix' : (state.category === 'identification' ? 'Identification' : (state.category === 'characters' ? 'Bible Characters' : 'Books of the Bible'));
    el.progressLabel.textContent = `${state.index + 1} of ${state.currentItems.length}`;
    el.answerReveal.textContent = '';
    updateStats();
    startTimer();
}

function startTimer() {
    clearInterval(state.timerId);
    clearTimeout(state.advanceId);
    state.timeLeft = 10;
    el.timer.textContent = state.timeLeft;
    el.timerBadge.classList.remove('warning');
    state.timerId = setInterval(() => {
        state.timeLeft -= 1;
        el.timer.textContent = state.timeLeft;
        el.timerBadge.classList.toggle('warning', state.timeLeft <= 3);

        if (state.timeLeft <= 0) {
            clearInterval(state.timerId);
            state.streak = 0;
            showMessage("Time's up! Click Reveal Answer to see the answer.", 'error');
            updateStats();
        }
    }, 1000);
}

function showMessage(text, type = '') {
    el.message.textContent = text;
    el.message.className = `message ${type}`.trim();
}

function advance(nextIndex) {
    clearTimeout(state.advanceId);
    state.index = nextIndex;
    state.hintUsed = false;
    if (state.index >= state.currentItems.length) {
        state.index = 0;
        showMessage('Great job! You finished the set. Starting over for another round.', 'success');
    }
    showCurrentPuzzle();
}

function handleCorrect() {
    const item = currentItem();
    state.solved.add(item.id);
    clearInterval(state.timerId);
    state.score += state.hintUsed ? 0 : 10;
    state.streak += 1;
    showMessage(`Correct! ${item.word} is right.`, 'success');
    el.answerReveal.textContent = `Answer: ${item.word}`;
    updateStats();
}

function resetRound(category, random = false) {
    state.category = category;
    state.randomMode = random;
    setItems();
    updateModeButtons();
    showCurrentPuzzle();
    showMessage('New round loaded. Read the question and reveal the answer when ready.');
}

el.hintBtn.addEventListener('click', () => {
    const item = currentItem();
    state.hintUsed = true;
    el.answerReveal.textContent = `Answer: ${item.word}`;
    showMessage('');
});

el.skipBtn.addEventListener('click', () => {
    state.streak = 0;
    showMessage('Skipped this one. Moving on.');
    advance(state.index + 1);
});

el.nextBtn.addEventListener('click', () => {
    advance(state.index + 1);
});

el.randomBtn.addEventListener('click', () => {
    resetRound('characters', true);
});

el.modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        resetRound(btn.dataset.category, false);
    });
});

setItems();
updateModeButtons();
showCurrentPuzzle();
updateStats();
