document.addEventListener("DOMContentLoaded", () => {
    const mazeContainer = document.getElementById("maze-container");
    const nextLevelButton = document.getElementById("next-level");
    const togglePacmanButton = document.getElementById("toggle-pacman");
    let rows = 10; // Initial number of rows
    let cols = 10; // Initial number of columns
    let isDrawing = false;
    let pacmanMode = false;
    let pacman = null;
    let pacmanPosition = { x: 1, y: 1 };
    let dots = [];
    let ghosts = [];

    function createMaze(rows, cols) {
        mazeContainer.innerHTML = ''; // Clear previous maze
        mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
        mazeContainer.style.gridTemplateRows = `repeat(${rows}, 20px)`;

        // Initialize the grid with all walls
        const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

        // Generate the maze using Recursive Backtracking algorithm
        function generateMaze(x, y) {
            const directions = [
                [0, -1], // left
                [0, 1],  // right
                [-1, 0], // up
                [1, 0]   // down
            ];

            // Shuffle the directions to ensure random maze generation
            directions.sort(() => Math.random() - 0.5);

            for (const [dx, dy] of directions) {
                const nx = x + dx * 2;
                const ny = y + dy * 2;

                if (nx > 0 && ny > 0 && nx < rows - 1 && ny < cols - 1 && grid[nx][ny] === 1) {
                    grid[nx - dx][ny - dy] = 0; // Remove wall between current cell and neighbor
                    grid[nx][ny] = 0;          // Mark neighbor as part of the maze
                    generateMaze(nx, ny);
                }
            }
        }

        // Start the maze generation from the top-left corner
        grid[1][1] = 0;
        generateMaze(1, 1);

        // Create the maze grid in the DOM
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                if (grid[i][j] === 1) {
                    cell.classList.add("wall");
                } else {
                    const dot = document.createElement("div");
                    dot.classList.add("dot");
                    cell.appendChild(dot);
                    dots.push(dot);
                }
                mazeContainer.appendChild(cell);
            }
        }

        // Set start and end points
        const startCell = mazeContainer.children[1 * cols + 1];
        startCell.style.backgroundColor = "green";
        pacmanPosition = { x: 1, y: 1 };
        updatePacmanPosition();

        // Initialize ghosts
        for (let i = 0; i < 3; i++) {
            const ghost = document.createElement("div");
            ghost.classList.add("ghost");
            mazeContainer.appendChild(ghost);
            ghosts.push({ x: rows - 2, y: cols - 2 });
            updateGhostPosition(ghost, ghosts[i]);
        }

        // Check if the maze is solvable
        function checkSolvable() {
            const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
            const queue = [[1, 1]]; // Starting point
            visited[1][1] = true;

            while (queue.length > 0) {
                const [x, y] = queue.shift();

                if (x === rows - 2 && y === cols - 2) {
                    document.body.style.backgroundColor = "#dff0d8"; // Green background for solvable maze
                    return true;
                }

                const directions = [
                    [0, -1], // left
                    [0, 1],  // right
                    [-1, 0], // up
                    [1, 0]   // down
                ];

                for (const [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && ny >= 0 && nx < rows && ny < cols && grid[nx][ny] === 0 && !visited[nx][ny]) {
                        queue.push([nx, ny]);
                        visited[nx][ny] = true;
                    }
                }
            }

            document.body.style.backgroundColor = "#f2dede"; // Red background for unsolvable maze
            return false;
        }

        checkSolvable();
    }

    function updatePacmanPosition() {
        pacman.style.gridRowStart = pacmanPosition.x + 1;
        pacman.style.gridColumnStart = pacmanPosition.y + 1;
    }

    function updateGhostPosition(ghostElement, ghostPosition) {
        ghostElement.style.gridRowStart = ghostPosition.x + 1;
        ghostElement.style.gridColumnStart = ghostPosition.y + 1;
    }

    function movePacman(dx, dy) {
        const newX = pacmanPosition.x + dx;
        const newY = pacmanPosition.y + dy;
        if (newX >= 0 && newY >= 0 && newX < rows && newY < cols && !mazeContainer.children[newX * cols + newY].classList.contains("wall")) {
            pacmanPosition.x = newX;
            pacmanPosition.y = newY;
            updatePacmanPosition();
            eatDot(newX, newY);
        }
    }

    function eatDot(x, y) {
        const index = x * cols + y;
        if (dots[index] && dots[index].parentNode) {
            dots[index].parentNode.removeChild(dots[index]);
            dots[index] = null;
            checkGameWin();
        }
    }

    function checkGameWin() {
        if (dots.every(dot => dot === null)) {
            alert("Congratulations! You have cleared the maze!");
            nextLevelButton.click();
        }
    }

    function moveGhosts() {
        const directions = [
            [0, -1], // left
            [0, 1],  // right
            [-1, 0], // up
            [1, 0]   // down
        ];

        for (let i = 0; i < ghosts.length; i++) {
            const ghost = ghosts[i];
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const newX = ghost.x + direction[0];
            const newY = ghost.y + direction[1];
            if (newX >= 0 && newY >= 0 && newX < rows && newY < cols && !mazeContainer.children[newX * cols + newY].classList.contains("wall")) {
                ghost.x = newX;
                ghost.y = newY;
                updateGhostPosition(mazeContainer.children[rows * newX + newY + 1], ghost);
                checkGhostCollision();
            }
        }
    }

    function checkGhostCollision() {
        for (let i = 0; i < ghosts.length; i++) {
            const ghost = ghosts[i];
            if (ghost.x === pacmanPosition.x && ghost.y === pacmanPosition.y) {
                alert("Game Over! You were caught by a ghost!");
                nextLevelButton.click();
            }
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
            moveGhosts();
        }
    });

    // Initial maze creation
    createMaze(rows, cols);

    // Next Level button event listener
    nextLevelButton.addEventListener("click", () => {
        rows += 2; // Increase the number of rows
        cols += 2; // Increase the number of columns
        createMaze(rows, cols);
    });

    // Toggle Pacman Mode button event listener
    togglePacmanButton.addEventListener("click", () => {
        pacmanMode = !pacmanMode;
        if (pacmanMode) {
            togglePacmanButton.textContent = "Pacman Mode On";
        } else {
            togglePacmanButton.textContent = "Pacman Mode Off";
        }
    });
});