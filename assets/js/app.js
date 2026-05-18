window.addEventListener("DOMContentLoaded", () => {
  const launcher = document.getElementById("launcher");
  const gameModal = document.getElementById("gameModal");
  const boardEl = document.getElementById("board");
  const difficultyEl = document.getElementById("difficulty");
  const winPopupEl = document.getElementById("winPopup");

  let isAITurn = false;
  let board = ["", "", "", "", "", "", "", "", ""];
  let current = "X";
  let gameOver = false;

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  window.openGame = function openGame() {
    launcher.classList.add("hidden");
    gameModal.style.display = "flex";
    resetGame();
  };

  window.closeGame = function closeGame() {
    gameModal.style.display = "none";
    launcher.classList.remove("hidden");
  };

  window.render = function render() {
    boardEl.innerHTML = "";
    board.forEach((val, i) => {
      const cell = document.createElement("div");
      cell.className = "cell " + (val ? val.toLowerCase() : "");
      cell.innerText = val;
      cell.onclick = () => move(i);
      boardEl.appendChild(cell);
    });
  };
  const render = window.render;

  window.move = function move(i) {
    if (board[i] || gameOver || isAITurn) return;

    difficultyEl.disabled = true;
    board[i] = "X";
    render();

    if (checkWin()) return;

    current = "O";
    isAITurn = true;

    setTimeout(() => {
      aiMove();
    }, 600);
  };
  const move = window.move;

  window.aiMove = function aiMove() {
    const empty = board.map((value, index) => (value === "" ? index : null)).filter((value) => value !== null);
    if (empty.length === 0) return;

    let moveIndex;
    const difficulty = difficultyEl.value;

    if (difficulty === "easy") {
      moveIndex = empty[Math.floor(Math.random() * empty.length)];
    } else {
      moveIndex = getBestMove();
    }

    board[moveIndex] = "O";
    render();

    if (checkWin()) {
      isAITurn = false;
      return;
    }

    current = "X";
    isAITurn = false;
  };
  const aiMove = window.aiMove;

  window.getBestMove = function getBestMove() {
    let bestScore = -Infinity;
    let moveIndex = 0;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        const score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          moveIndex = i;
        }
      }
    }

    return moveIndex;
  };
  const getBestMove = window.getBestMove;

  window.minimax = function minimax(state, depth, isMaximizing) {
    if (checkWinner(state, "O")) return 10 - depth;
    if (checkWinner(state, "X")) return depth - 10;
    if (!state.includes("")) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (state[i] === "") {
          state[i] = "O";
          const score = minimax(state, depth + 1, false);
          state[i] = "";
          best = Math.max(score, best);
        }
      }
      return best;
    }

    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "X";
        const score = minimax(state, depth + 1, true);
        state[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  };
  const minimax = window.minimax;

  window.checkWinner = function checkWinner(state, player) {
    return winPatterns.some((pattern) => pattern.every((index) => state[index] === player));
  };
  const checkWinner = window.checkWinner;

  window.checkWin = function checkWin() {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        gameOver = true;
        setTimeout(() => {
          show(board[a] === "X" ? "\uD83C\uDF89 YOU WIN!" : "\uD83E\uDD16 AI WINS");
        }, 800);
        return true;
      }
    }

    if (!board.includes("")) {
      gameOver = true;
      setTimeout(() => {
        show("\uD83D\uDE10 DRAW");
      }, 800);
      return true;
    }

    return false;
  };
  const checkWin = window.checkWin;

  window.show = function show(text) {
    winPopupEl.style.display = "flex";
    winPopupEl.innerText = text;
    setTimeout(() => {
      winPopupEl.style.display = "none";
      resetGame();
    }, 1800);
  };
  const show = window.show;

  window.resetGame = function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    current = "X";
    gameOver = false;
    isAITurn = false;
    difficultyEl.disabled = false;
    winPopupEl.style.display = "none";
    render();
  };
  const resetGame = window.resetGame;

  document.getElementById("openGameBtn").addEventListener("click", openGame);
  document.getElementById("closeGameBtn").addEventListener("click", closeGame);
  document.getElementById("restartBtn").addEventListener("click", resetGame);

  render();
  openGame();
});
