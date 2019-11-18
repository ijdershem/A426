// import Snake from "./snake";
import Tile from "./tile.js";

export default class Board {
    // Board size, x and y coordinates for snake start
    constructor(s,x,y) {
        this.size = s;
        this.sqs = s * s;
        this.snake = [[x,y]];
        // 2D array in row major order
        this.bo = [];
        this.dir = '';
        this.ate = 0;

        this.winArr = [];
        this.loseArr = [];

        this.newBoard();
        this.giveSnake(x,y);
        this.addFood();
    }

    // METHODS RELATED TO THE BOARD

    getSize() {
        return this.size;
    }

    // METHODS RELATED TO SETTING UP A NEW BOARD

    // Create a new board
    newBoard() {
        for(var i=0;i<this.size;i++) {
            var row = [];
            for(var j=0;j<this.size;j++) {
                row.push(new Tile());
            }
            this.bo.push(row);
        }
    }

    // Create a new snake array
    newSnake(x,y) {
        var newS = [[x,y]];
        this.giveSnake(newS[0]);
        return newS;
    }

    // METHODS RELATED TO MOVE

    // Makes a move each time it is time to
    move() {
        // Check if the player has made the first move
        // console.log('move called');
        if (this.dir == '') {
            // console.log('no dir');
            return;
        } else {
            // console.log('move being made, dir is ' + this.dir + ' and the head is at ' + this.getHead()[0] + ', ' + this.getHead()[1]);

            // Add a new head and set the tile's snake property to true
            let newH = this.addDir(this.getHead());
            // console.log('new head is at ' + newH[0] + ', ' + newH[1]);
            this.snake.unshift(newH);
            // console.log('new head added, snake is now ' + this.snake.toString());

            // Check if the new head tile is on food
            if (this.getHeadTile().hasSnake()) {
                return false;
            } else {
                this.giveSnake(newH[0],newH[1]);
                if (this.getHeadTile().hasFood()) {
                    // console.log('snake head is on food');
                    this.getHeadTile().remFood();
                    this.addFood();
                    return true;
                } else {
                    // Take off tail and set the tile's snake property to false
                    // console.log('snake head is NOT on food');
                    let tail = this.snake.pop();
                    this.takeSnake(tail[0],tail[1]);
                    // console.log('snake is now ' + this.snake.toString());
                    return true;
                }

            }

        }

    }

    // Adds the direction to coordinates to find where the new coordinate is
    addDir(cor) {
        // console.log('adding dir to the head')
        if (this.dir == 'up') {
            cor[0]--;
            // console.log('dir is up, cor is now ' + cor.toString());
        } else if (this.dir == 'down') {
            cor[0]++;
            // console.log('dir is down, cor is now ' + cor.toString());
        } else if (this.dir == 'right') {
            cor[1]++;
            // console.log('dir is right, cor is now ' + cor.toString());
        } else if (this.dir == 'left') {
            cor[1]--;
            // console.log('dir is left, cor is now ' + cor.toString());
        } else {
            return;
        }

        return cor;
    }

    // METHODS FOR CALLBACK WHEN GAME EVENTS HAPPEN
    
    onWin(callback) {
        this.winArr.push(callback);
    }

    onLose() {
        this.loseArr.push(callback);
    }

    // METHODS RELATED TO THE FOOD

    addFood() {
        var xCo = Math.floor(Math.random() * this.bo.length);
        var yCo = Math.floor(Math.random() * this.bo.length);
        if (this.bo[xCo][yCo].hasFood() || this.bo[xCo][yCo].hasSnake()) {
            if (this.addFood()) {
                return true;
            }
        } else {
            this.bo[xCo][yCo].addFood();
            return true;
        }

        return false;
    }

    // METHODS RELATED TO THE SNAKE

    // Returns the coordinates of the head of the snake in a [x,y] array
    getHead() {
        // console.log(this.snake.toString());
        return [this.snake[0][0],this.snake[0][1]];
    }

    // Returns the tile of the head of the snake
    getHeadTile() {
        return this.findTile(this.getHead()[0],this.getHead()[1]);
    }

    // Returns an array of the snake's body coordinates
    getBody() {
        return this.snake;
    }

    // METHODS USED TO CHANGE TILE PROPERTIES

    // Returns the tile at the given coordinates; cor is [x,y]
    findTile(x,y) {
        // console.log('board:');
        // console.log(this.bo[1][1].toString());
        // console.log(this.bo[y].toString());
        // console.log('find tile called');
        return this.bo[y][x];
    }

    getTileId(x,y) {
        // console.log('finding tile');
        let t = this.findTile(x,y);
        // console.log('found tile: ' + t);
        return t.getId();
    }

    // Changes .hasSnake at the tile to 'true'; cor is [x,y]
    giveSnake(x,y) {
        this.bo[y][x].addSnake();
    }

    // Changes .hasSnake at the tile to 'false'; cor is [x,y]
    takeSnake(x,y) {
        this.bo[y][x].remSnake();
    }

    // METHODS USED TO CHANGE DIRECTIONS

    // Changes this.dir
    setDir(d) {
        this.dir = d;
        // console.log('dir changed to ' + this.dir);
    }

    // METHODS USED TO TEST BOARD

    // Print the board and its properties
    toString() {
        var str = '';
        for(var i=0;i<this.bo.length;i++) {
            var row = '';
            for(var j=0;j<this.bo[i].length;j++) {
                row += this.bo[i][j].toString();
            }
            row += '\n';
            str += row;
        }

        return str;
    }
}