document.addEventListener("DOMContentLoaded", function() {
    const grid = document.getElementById("grid");
    const root = document.documentElement;
    let gridSize = 20, cells = [], intervalId = null;

    root.style.setProperty('--cells', gridSize);
    createGrid();

    document.getElementById("grid-size").addEventListener("change", () => {
        const newSize = parseInt(document.getElementById("grid-size").value);
        if (newSize > 0 && newSize <= 100) {
            gridSize = newSize;
            createGrid();
        } else {
            alert("Grid size must be between 1 and 100");
        }
    });

    document.getElementById("speed-control").addEventListener("change", () => {
        if (intervalId) {
            const speed = 500 - document.getElementById("speed-control").value;
            clearInterval(intervalId);
            intervalId = setInterval(updateCells, speed);
            
        }
        const displayValue = document.getElementById('speed');
        const display = document.getElementById("speed-control").value / 500 * 100
        displayValue.textContent = `Speed: ${display.toFixed(0)}%`
    });

    ["start", "randomize", "reset"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => handleControlClick(id));
    });

    function createGrid() {
        grid.innerHTML = '';
        cells = Array.from({ length: gridSize * gridSize }, () => {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("click", () => cell.classList.toggle("alive"));
            grid.appendChild(cell);
            return cell;
        });
        root.style.setProperty('--cells', gridSize);
        clearInterval(intervalId);
        intervalId = null;
    }

    function handleControlClick(id) {
        const startButton = document.getElementById("start");
        if (id === "start") {
            if (!intervalId) {
                intervalId = setInterval(updateCells, 10);
                startButton.classList.add("active");
                startButton.textContent = "Stop";
            } else {
                clearInterval(intervalId);
                intervalId = null;
                startButton.classList.remove("active");
                startButton.textContent = "Start";
            }
        } else if (id === "randomize") {
            cells.forEach(cell => cell.classList.toggle("alive", Math.random() < 0.5));
        } else if (id === "reset") {
            createGrid();
        }
    }

    function updateCells() {
        let newStates = cells.map((cell, i) => {
            let row = Math.floor(i / gridSize), col = i % gridSize, liveNeighbors = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue;
                    let neighborIndex = ((row + x + gridSize) % gridSize) * gridSize + (col + y + gridSize) % gridSize;
                    if (cells[neighborIndex].classList.contains("alive")) liveNeighbors++;
                }
            }
            return cell.classList.contains("alive") ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3;
        });
        cells.forEach((cell, i) => cell.classList.toggle("alive", newStates[i]));
    }
});
