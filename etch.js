const grid = document.getElementById("grid-container");
const gridHeight = 512;
const gridWidth = 384;
let gridPixelsPerUnit = 16;

let prevX = -1;
let prevY = -1;
var gridCreated = false;

let totalDrawnBlocks = 0;
let correctDrawnBlocks= 0;

var mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => { mouseDown = false; prevX = -1; prevY = -1; }

var img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'https://i.ibb.co/DgPH8WG/test-picture.jpg';

var canvas = document.getElementById('canvas');
canvas.height = 512;
var ctx = canvas.getContext('2d');

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
    gridCreated = true;
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
            document.getElementById(newX + "-" + newY).classList.add('black');
        }
    }
    
    document.getElementById(id).classList.add('black');
    prevX = curX;
    prevY = curY;
}

var getCanvasBoxes = function() {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
    let newLine = 4 * (gridWidth - (gridPixelsPerUnit * 1.5)) * gridPixelsPerUnit;
    let startI = (4 * gridWidth * (gridPixelsPerUnit / 2)) + (4 * (gridPixelsPerUnit / 2));
    
    let xPos = 0;
    let yPos = 0;
	for (var i = startI; i < data.length - 4; i += 4 * gridPixelsPerUnit) {
        if(xPos == gridWidth / gridPixelsPerUnit) { yPos++; xPos = 0; i += newLine; }
        let dataAverage = (data[i] + data[i + 1] + data[1 + 2]) / 3;
        if(dataAverage < 100 && document.getElementById(xPos + "-" + yPos)) {
            document.getElementById(xPos + "-" + yPos).classList.add('gray');
        }
        xPos++;
	}
	ctx.putImageData(imageData, 0, 0);
};

function changeImage() {
    clearDrawing();
    clearImage();
    img.src = "https://i.ibb.co/mzWPNss/Untitled-1.jpg";
    img.onload = getCanvasBoxes;
}

function clearImage() {
    var grays = document.querySelectorAll('.gray');
    for(var i = 0; i < grays.length; i++) grays[i].classList.remove('gray');
}

function clearDrawing() {
    var blacks = document.querySelectorAll('.black');
    for(var i = 0; i < blacks.length; i++) blacks[i].classList.remove('black');
}

img.onload = function() {
    createGrid();
    getCanvasBoxes();
}