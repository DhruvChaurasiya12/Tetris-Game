const rows = 18;
const columns = 15;

const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
ctx.scale(30,30);

let scoreValue = document.querySelector("#score-value");
let score = 0;

let button = document.querySelector("button");
let pause = false;

let pieceObject = null;
let piece = null;

let grid = generateGrid();
let lastChanceCount = 0;

const shapes = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [0,0,0],
        [1,1,0],
        [0,1,1]
    ],
    [
        [0,0,0],
        [0,1,1],
        [1,1,0]
    ],
    [
        [0,0,0],
        [1,1,1],
        [0,1,0]
    ],
    [
        [1,1],
        [1,1]
    ]
];

const colors = [
    "#E5DDC8",
    "#004369",
    "#DB1F48",
    "#0E86D4",
    "#F8D210",
    "#2FF3E0",
    "#0C1446",
    "#FFC1D6"
];


setInterval(startGame,500);

function startGame(){

    if(pause) return;

    checkGrid();
    if(pieceObject == null){
        pieceObject = generatePiece();
        displayPiece();
    }
    movedown();
}

function generatePiece(){
    let index = Math.floor(Math.random() * (7))
    piece = shapes[index];
    let colorIndex = index+1;
    let x = 6;
    let y = 0;

    return {piece,colorIndex,x,y};
}

function displayPiece(){

    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece.length;j++){
            if(piece[i][j]==1){
                ctx.fillStyle = colors[pieceObject.colorIndex];
                ctx.fillRect(pieceObject.x+j, pieceObject.y+i, 1, 1);
            }
        }
    }
}

function generateGrid(){
    let grid = [];
    for(let i=0;i<rows;i++){
        grid.push([]);
        for(let j=0;j<columns;j++){
            grid[i].push(0);
        }
    }
    return grid;
}

function displayGrid(){

    for(let i=0;i<rows;i++){
        for(let j=0;j<columns;j++){
            if (grid[i][j] > 0) { // If the cell is occupied, draw its color
                ctx.fillStyle = colors[grid[i][j]];
                ctx.fillRect(j, i, 1, 1);
            } else {
                ctx.fillStyle = colors[0]; // Empty space
                ctx.fillRect(j, i, 1, 1);
            }
        }
    }

    displayPiece();
}

function checkGrid(){
    let count = 0;

    for(let i=0;i<grid.length;i++){
        let allFilled = true;
        for(let j=0;j<grid.length;j++){
            if(grid[i][j] == 0){
                allFilled = false
            }
        }
        if(allFilled){
            console.log("all filled")
            count++;
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
    }
    if(count == 1){
        score+=10;
    }else if(count == 2){
        score+=30;
    }else if(count == 3){
        score+=50;
    }else if(count>3){
        score+=100
    }
    scoreValue.innerText = score;
}

function movedown(){

    if(!collosion(pieceObject.x, pieceObject.y+1)){
        pieceObject.y += 1;
        displayGrid();
    }

    else{
        for(let i=0;i<piece.length;i++){
            for(let j=0;j<piece.length;j++){
                if(piece[i][j]==1){
                    let p = pieceObject.x + j;
                    let q = pieceObject.y + i;
                    grid[q][p] = pieceObject.colorIndex;
                }
            }
        }
        if(pieceObject.y == 0){
            alert("gamer over!");
            grid = generateGrid();
            score = 0;
        }

        pieceObject = null;
        piece = null;
        lastChanceCount=0;
    }
}

function moveLeft(){
    if(!collosion(pieceObject.x-1, pieceObject.y)){
        pieceObject.x -= 1;
        displayGrid();
    }
}

function moveRight(){
    if(!collosion(pieceObject.x+1, pieceObject.y)){
        pieceObject.x += 1;
        displayGrid();
    }
}

function rotate(){

    let size = piece.length;

    if(pieceObject.x < 0 || pieceObject.x + size >= columns) return;



    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            
            let p = pieceObject.x + j;
            let q = pieceObject.y + i;
            if(grid[q][p] > 0) return;
        }
    }
    
    for(let i=0;i<size;i++){
        for(let j=0;j<i;j++){

            let temp = piece[i][j];
            piece[i][j] = piece[j][i];
            piece[j][i] = temp;
        }
    }

    for(let i=0;i<size;i++){
        for(let j=0,k=size-1; j<k; j++,k--){
            let temp = piece[i][j];
            piece[i][j] = piece[i][k];
            piece[i][k] = temp; 
        }
    }
}

document.addEventListener("keydown", (e)=>{
    let key = e.key;

    if(pieceObject.y + pieceObject.piece.length <= rows-1){
        if(key == "ArrowRight") moveRight();
        else if(key == "ArrowLeft") moveLeft();
        else if(key == "ArrowDown") movedown();
        else if(key == "ArrowUp") rotate();    
    }
    else if(lastChanceCount<1 && (key == "ArrowLeft" || key == "ArrowRight")){
        if(key == "ArrowRight") moveRight();
        else if(key == "ArrowLeft") moveLeft();
        lastChanceCount++;
    }
})


function collosion(x,y){

    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece.length;j++){
            if(piece[i][j]==1){
                let p = x + j;
                let q = y + i;

                if(p>=0 && p<columns && q>=0 && q<rows){
                    if(grid[q][p]>0){
                        return true;
                    }
                }
                
                else{
                    return true;
                }
            }
        }
    }
    return false;
}


button.addEventListener("click", ()=>{
    pause = !pause;

    if(pause){
        button.innerText = "Play";
    }
    else{
        button.innerText = "Pause";
    }
})