const grid = document.getElementById("grid-container");
var gridSize = 512;
var gridHeight = 512;
var gridWidth = 384;
var gridPixelsPerUnit = 8;

var mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

let prevX = -1;
let prevY = -1;

function createGrid() {
    grid.style.width = gridWidth + "px";
    grid.style.height = gridHeight + "px";

    var boxCountX = gridWidth / gridPixelsPerUnit;
    var boxCountY = gridHeight / gridPixelsPerUnit;
    for(var y = 0; y < boxCountY; y++) {
        for(var x = 0; x < boxCountX; x++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.id = `${x}-${y}`;
            box.style.height = gridPixelsPerUnit + "px";
            box.style.width = gridPixelsPerUnit + "px";
            box.addEventListener('mouseover', drawOnBox);
            box.addEventListener('mousedown', drawOnBox);
            grid.appendChild(box);
        }
    }
}

function drawOnBox(e) {
    if(!mouseDown) return;

    var id = e.target.id;
    let curX = parseInt(id.split('-')[0]);
    let curY = parseInt(id.split('-')[1]);

    if(prevX != -1 && prevY != -1) {
        var totalSteps, xSteps, ySteps, newX, newY;
        xSteps = Math.abs(curX - prevX);
        ySteps = Math.abs(curY - prevY);
        if(xSteps > ySteps) totalSteps = xSteps;
        else totalSteps = ySteps;

        for(var i = 1; i < totalSteps; i++) {
            newX = prevX + Math.round((xSteps / totalSteps) * i) * Math.sign(curX - prevX);
            newY = prevY + Math.round((ySteps / totalSteps) * i) * Math.sign(curY - prevY);
            console.log(newX);
            document.getElementById(newX + "-" + newY).classList.add('block');
        }
    }
    
    document.getElementById(id).classList.add('block');
    prevX = curX;
    prevY = curY;
}

window.onload = () => {
    createGrid();
    DrawCanvas();
}