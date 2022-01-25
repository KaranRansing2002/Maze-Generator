const canvas=document.getElementById("canvas");
const ctx= canvas.getContext('2d');

let grid=[];
let size=600;
let rows=20;
let cols=20;
let cellSize=size/rows;
let currentCell;
let stack=[];

class Cell{
    constructor(rownum,colnum){
        this.rownum=rownum
        this.colnum=colnum;
        this.walls={
            left : 1,
            right : 1,
            top : 1,
            bottom : 1,
        }
        this.visited=false;
    }
    drawLeftWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x,y);
        ctx.lineTo(x,y+size/rows);
        ctx.stroke();
    }
    drawRightWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x+size/cols,y);
        ctx.lineTo(x+size/cols,y+size/rows);
        ctx.stroke();
    }
    drawBottomWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x,y+size/rows);
        ctx.lineTo(x+size/cols,y+size/rows);
        ctx.stroke();
    }
    drawTopWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x,y);
        ctx.lineTo(x+size/cols,y);
        ctx.stroke();
    }
    show(){
        ctx.strokeStyle="green";
        //ctx.fillStyle="coral";
        ctx.lineWidth=2;

        if(this.walls.left) this.drawLeftWall();
        if(this.walls.right) this.drawRightWall();
        if(this.walls.bottom) this.drawBottomWall();
        if(this.walls.Top) this.drawTopWall();

    }
    bringNeighbours(){
        let topCell=this.rownum==0 ? undefined : grid[this.rownum-1][this.colnum];
        let leftCell=this.colnum==0 ? undefined : grid[this.rownum][this.colnum-1];
        let rightCell=this.colnum==grid.length-1 ? undefined : grid[this.rownum][this.colnum+1];
        let bottomCell=this.rownum==grid.length-1 ? undefined : grid[this.rownum+1][this.colnum];

        let neighbours=[];
        if(topCell && !topCell.visited) neighbours.push(topCell); 
        if(leftCell && !leftCell.visited) neighbours.push(leftCell); 
        if(rightCell && !rightCell.visited) neighbours.push(rightCell); 
        if(bottomCell && !bottomCell.visited) neighbours.push(bottomCell);
        
        if(neighbours.length){
            return neighbours[Math.floor(Math.random()*neighbours.length)];
        }
        return undefined;
    }
    removeWalls(cell){
        console.log(this.rownum,this.colnum,cell.rownum,cell.colnum)
        let x=this.colnum-cell.colnum;
        let y=this.rownum-cell.rownum;
        if (x === 1) {
            this.walls.left = false;
            cell.walls.right = false;
        } else if (x === -1) {
            this.walls.right = false;
            cell.walls.left = false;
        }
        if (y === 1) {
            this.walls.top = false;
            cell.walls.bottom = false;
        } else if (y === -1) {
            this.walls.bottom = false;
            cell.walls.top = false;
        }
    }
    
}

for(let i=0;i<rows;i++){
    let row=[];
    for(let j=0;j<cols;j++){
        row.push(new Cell(i,j));
    }
    grid.push(row);
}
currentCell=grid[0][0];
function draw(){
    canvas.width = size;
    canvas.height = size;
    canvas.style.background="rgba(0, 0, 0, 0.712)"

    currentCell.visited=true;
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            grid[i][j].show();
        }
    }
    let nextcell=currentCell.bringNeighbours();
    if(nextcell){
        nextcell.visited=true;
        stack.push(currentCell);
        currentCell.removeWalls(nextcell);
        //console.log(nextcell.rownum,nextcell.colnum);
        currentCell=nextcell;
    }
    else if(stack.length>0){
        currentCell=stack.pop();
    }
    else if(stack.length===0){
        alert("done");
        return;
    }
    requestAnimationFrame(()=>{
        draw();
    });
    
}
draw();




