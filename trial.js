const canvas=document.getElementById("canvas");
const ctx= canvas.getContext('2d');


let curr;

//canvas.style.background="";

class Maze{
    constructor(size,rows,cols){
        this.size=size;
        this.rows=rows;
        this.cols=cols;
        this.grid=[];
        this.stack=[];
    }

    setUp(){
        for(let i=0;i<this.rows;i++){
            let row=[];
            for(let j=0;j<this.cols;j++){
                let cell=new Cell(i,j,this.grid,this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        //console.log(this.grid.length)
        curr=this.grid[0][0];
    }
    draw(){
        canvas.width = this.size;
        canvas.height = this.size;
        canvas.style.background="coral"

        curr.visited=true;
        for(let i=0;i<this.rows;i++){
            for(let j=0;j<this.cols;j++){
                let grid=this.grid;
                grid[i][j].show(this.size,this.rows,this.cols);
            }
        }
        let nextCell=curr.giveAllValidNeighbours();
        if(nextCell){
            nextCell.visited=true;
            this.stack.push(curr);
            curr.removeWalls(curr,nextCell);
            console.log(curr.rowNum,curr.colNum,nextCell.rowNum,nextCell.colNum,curr.walls.right,nextCell.walls.left);
            curr=nextCell;
        }
        else if(this.stack.length>0){
            curr=this.stack.pop();
        }
        else{
            alert("done");
            return;
        }
        window.requestAnimationFrame(()=>{
            this.draw();
        })
    }
    
}

class Cell{
    constructor(rowNum,colNum,mainGrid,mainSize){
         this.rowNum=rowNum;
         this.colNum=colNum;
         this.mainGrid=mainGrid;
         this.mainSize=mainSize;
         this.visited=false;
         this.walls={
             left : 1,
             right : 1,
             top : 1,
             bottom :1,
         };
    }

    drawTop(x,y,size,rows,cols){
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x+size/cols,y);
        ctx.stroke();
    }
    drawLeft(x,y,size,rows,cols){
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x,y+size/rows);
        ctx.stroke();
    }
    drawBottom(x,y,size,rows,cols){
        ctx.beginPath();
        ctx.moveTo(x,y+size/rows);
        ctx.lineTo(x+size/cols,y+size/rows);
        ctx.stroke();
    }
    drawRight(x,y,size,rows,cols){
        ctx.beginPath();
        ctx.moveTo(x+size/cols,y);
        ctx.lineTo(x+size/cols,y+size/rows);
        ctx.stroke();
    }
    show(size,rows,cols){
        let x = (this.colNum*size) / cols;
        let y = (this.rowNum*size) / rows;

        ctx.strokeStyle="green";
        ctx.fillStyle="coral";
        ctx.lineWidth=2;

        if(this.walls.left) this.drawLeft(x,y,size,rows,cols);
        if(this.walls.right) this.drawRight(x,y,size,rows,cols);
        if(this.walls.bottom) this.drawBottom(x,y,size,rows,cols);
        if(this.walls.Top) this.drawTop(x,y,size,rows,cols);

        if(this.visited){
            ctx.fillRect(x+1 , y+1 , size / cols-2 ,size / rows-2);
        }
    }
    giveAllValidNeighbours(){
        let grid = this.mainGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];
        let topCell=row==0 ? undefined : grid[row-1][col];
        let rightCell = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottomCell = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let leftCell = col !== 0 ? grid[row][col - 1] : undefined;

        if(topCell && !topCell.visited) neighbours.push(topCell);
        if(leftCell && !leftCell.visited) neighbours.push(leftCell);
        if(rightCell && !rightCell.visited) neighbours.push(rightCell);
        if(bottomCell && !bottomCell.visited) neighbours.push(bottomCell);        

        if(neighbours.length){
            return neighbours[Math.floor(Math.random()*neighbours.length)];
        }
        else{
            return undefined;
        }
    }
    removeWalls(cell1,cell2){
        console.log(cell1.rowNum,cell1.colNum,cell2.rowNum,cell2.colNum);
        let x = cell1.colNum - cell2.colNum;
        // Removes the relevant walls if there is a different on x axis
        if (x === 1) {
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else if (x === -1) {
            cell1.walls.right = false;
            cell2.walls.left = false;
        }
        // compares to two cells on x axis
        let y = cell1.rowNum - cell2.rowNum;
        // Removes the relevant walls if there is a different on x axis
        if (y === 1) {
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        } else if (y === -1) {
            cell1.walls.bottom = false;
            cell2.walls.top = false;
        }
    }
}
let maze=new Maze(600,20,20);
maze.setUp();
// maze.grid[0][2].walls.left=false;
// maze.grid[0][1].walls.right=false;
maze.draw();

