document.addEventListener("DOMContentLoaded", () => {
    const mazeContainer = document.getElementById("maze-container");
    const nextLevelButton = document.getElementById("next-level");
    const togglePacmanButton = document.getElementById("toggle-pacman");
    let rows = 10; // Initial number of rows
    let cols = 10; // Initial number of columns
    let isDrawing = false;
    let maze = [];
    let pacmanMode = false;
    let pacman = null;
    let pacmanPosition = { x: 1, y: 1 };
    let dots = [];

    function createMaze(rows, cols) {
        mazeContainer.innerHTML = ''; // Clear previous maze
        mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
        mazeContainer.style.gridTemplateRows = `repeat(${rows}, 20px)`;

        maze = Array.from({ length: rows }, () => Array(cols).fill(0));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                if (maze[i][j] === 1) {
                    cell.classList.add("wall");
                } else {
                    const dot = document.createElement("div");
                    dot.classList.add("dot");
                    cell.appendChild(dot);
                    dots.push(dot);
                }
                cell.addEventListener("mousedown", () => {
                    if (!pacmanMode) {
                        isDrawing = true;
                        togglePacmanButton.disabled = true;
                        cell.classList.toggle("wall");
                        maze[i][j] = maze[i][j] === 1 ? 0 : 1;
                    }
                });
                cell.addEventListener("mouseover", () => {
                    if (isDrawing && !pacmanMode) {
                        cell.classList.toggle("wall");
                        maze[i][j] = maze[i][j] === 1 ? 0 : 1;
                    }
                });
                mazeContainer.appendChild(cell);
            }
        }

        const startCell = mazeContainer.children[1 * cols + 1];
        startCell.style.backgroundColor = "green";
        pacmanPosition = { x: 1, y: 1 };
        updatePacmanPosition();

        const endCell = mazeContainer.children[(rows - 2) * cols + (cols - 2)];
        endCell.style.backgroundColor = "red";

        generateDots();
    }

    function generateDots() {
        dots.forEach(dot => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
        });
        dots = [];

        for (let i = 1; i < rows - 1; i++) {
            for (let j = 1; j < cols - 1; j++) {
                if (maze[i][j] === 0) {
                    const dot = document.createElement("div");
                    dot.classList.add("dot");
                    mazeContainer.children[i * cols + j].appendChild(dot);
                    dots.push(dot);
                }
            }
        }
    }

    function updatePacmanPosition() {
        if (pacman) {
            pacman.style.gridRowStart = pacmanPosition.x + 1;
            pacman.style.gridColumnStart = pacmanPosition.y + 1;
        }
    }

    function movePacman(dx, dy) {
        const newX = pacmanPosition.x + dx;
        const newY = pacmanPosition.y + dy;
        if (newX >= 0 && newY >= 0 && newX < rows && newY < cols && maze[newX][newY] !== 1) {
            pacmanPosition.x = newX;
            pacmanPosition.y = newY;
            updatePacmanPosition();
            eatDot(newX, newY);
        }
    }

    function eatDot(x, y) {
        const index = x * cols + y;
        const cell = mazeContainer.children[index];
        if (cell && cell.querySelector(".dot")) {
            cell.removeChild(cell.querySelector(".dot"));
            checkGameWin();
        }
    }

    function checkGameWin() {
        if (dots.length === 0) {
            alert("Congratulations! You have cleared the maze!");
            nextLevelButton.click();
        }
    }

    document.addEventListener("keydown", (e) => {
        if (pacmanMode) {
            switch (e.key) {
                case "ArrowUp":
                    movePacman(-1, 0);
                    break;
                case "ArrowDown":
                    movePacman(1, 0);
                    break;
                case "ArrowLeft":
                    movePacman(0, -1);
                    break;
                case "ArrowRight":
                    movePacman(0, 1);
                    break;
            }
        }
    });

    nextLevelButton.addEventListener("click", () => {
        rows += 2;
        cols += 2;
        createMaze(rows, cols);
    });

    togglePacmanButton.addEventListener("click", () => {
        pacmanMode = !pacmanMode;
        if (pacmanMode) {
            togglePacmanButton.textContent = "Pacman Mode On";
            togglePacmanButton.disabled = true;
            if (!pacman) {
                pacman = document.createElement("div");
                pacman.classList.add("pacman");
                mazeContainer.appendChild(pacman);
            }
            updatePacmanPosition();
        } else {
            togglePacmanButton.textContent = "Pacman Mode Off";
            togglePacmanButton.disabled = false;
            if (pacman && pacman.parentNode) {
                pacman.parentNode.removeChild(pacman);
                pacman = null;
            }
        }
    });

    createMaze(rows, cols);
});