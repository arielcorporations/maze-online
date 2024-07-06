document.addEventListener("DOMContentLoaded", () => {
    const mazeContainer = document.getElementById("maze-container");
    const nextLevelButton = document.getElementById("next-level");
    let rows = 10; // Initial number of rows
    let cols = 10; // Initial number of columns
    let isDrawing = false;

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
                }
                cell.addEventListener("mousedown", () => {
                    isDrawing = true;
                    cell.classList.toggle("wall");
                    grid[i][j] = grid[i][j] === 0 ? 1 : 0; // Toggle wall in the grid
                    checkSolvable();
                });
                cell.addEventListener("mouseover", () => {
                    if (isDrawing) {
                        cell.classList.add("wall");
                        grid[i][j] = 1; // Set wall in the grid
                        checkSolvable();
                    }
                });
                mazeContainer.appendChild(cell);
            }
        }

        document.body.addEventListener("mouseup", () => {
            isDrawing = false;
        });

        // Set start and end points
        const startCell = mazeContainer.children[1 * cols + 1];
        const endCell = mazeContainer.children[(rows - 2) * cols + (cols - 2)];
        startCell.style.backgroundColor = "green";
        endCell.style.backgroundColor = "red";

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

    // Initial maze creation
    createMaze(rows, cols);

    // Next Level button event listener
    nextLevelButton.addEventListener("click", () => {
        rows += 2; // Increase the number of rows
        cols += 2; // Increase the number of columns
        createMaze(rows, cols);
    });
});