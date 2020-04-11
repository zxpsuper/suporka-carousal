import StorageManager from './storageManager';
import InputManager from './inputManager';
import Actuator from './actuator';
import Grid from './grid';
import Tile from './tile';

export default class Game2048 {
    constructor() {
        this.size = 4;
        this.storageManager = new StorageManager();
        this.inputManager = new InputManager();
        this.actuator = new Actuator();
        this.startTiles = 2; // 最开始添加的数字块数量

        // this.inputManager.on('move', this.move.bind(this));
        // this.inputManager.on('restart', this.restart.bind(this));
        // this.inputManager.on('keepPlaying', this.keepPlaying.bind(this));
        this.setup(); // 初始化
    }
    setup() {
        // 获取之前游戏状态
        var previousState = this.storageManager.getGameState();

        // 加载上一次玩的游戏状态数据
        if (previousState) {
            this.grid = new Grid(
                previousState.grid.size,
                previousState.grid.cells
            );
            this.score = previousState.score;
            this.over = previousState.over;
            this.won = previousState.won;
            this.keepPlaying = previousState.keepPlaying;
        } else {
            this.grid = new Grid(this.size);
            this.score = 0;
            this.over = false;
            this.won = false;
            this.keepPlaying = false;

            // 添加初始的数字块，这里是2块
            this.addStartTiles();
        }

        // Update the actuator
        this.actuate();
    }
    addStartTiles() {
        for (var i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }
    addRandomTile() {
        if (this.grid.cellsAvailable()) {
            var value = Math.random() < 0.9 ? 2 : 4; // 90%几率增加一个2,10%几率增加一个4
            var tile = new Tile(this.grid.randomAvailableCell(), value);
            // 往格子插入块
            this.grid.insertTile(tile);
        }
    }
    // 移动 0 1 2 3
    move(direction) {
        // 0: up, 1: right, 2: down, 3: left
        var self = this;
        // 游戏结束也就不移动了
        if (this.isGameTerminated()) return;

        var cell, tile;

        var vector = this.getVector(direction);
        var traversals = this.buildTraversals(vector);
        var moved = false;

        // Save the current tile positions and remove merger information
        this.prepareTiles();

        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach(function(x) {
            traversals.y.forEach(function(y) {
                cell = { x: x, y: y };
                tile = self.grid.cellContent(cell);

                if (tile) {
                    var positions = self.findFarthestPosition(cell, vector);
                    var next = self.grid.cellContent(positions.next);

                    // Only one merger per row traversal?
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        var merged = new Tile(positions.next, tile.value * 2);
                        merged.mergedFrom = [tile, next];

                        self.grid.insertTile(merged);
                        self.grid.removeTile(tile);

                        // Converge the two tiles' positions
                        tile.updatePosition(positions.next);

                        // Update the score
                        self.score += merged.value;

                        // The mighty 2048 tile
                        if (merged.value === 2048) self.won = true;
                    } else {
                        self.moveTile(tile, positions.farthest);
                    }

                    if (!self.positionsEqual(cell, tile)) {
                        moved = true; // The tile moved from its original cell!
                    }
                }
            });
        });

        if (moved) {
            this.addRandomTile();

            if (!this.movesAvailable()) {
                this.over = true; // Game over!
            }

            this.actuate();
        }
    }
    getVector(direction) {
        // Vectors representing tile movement
        var map = {
            0: { x: 0, y: -1 }, // Up
            1: { x: 1, y: 0 }, // Right
            2: { x: 0, y: 1 }, // Down
            3: { x: -1, y: 0 }, // Left
        };

        return map[direction];
    }
    buildTraversals(vector) {
        var traversals = { x: [], y: [] };

        for (var pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();

        return traversals;
    }
    // 游戏结束
    isGameTerminated() {
        return this.over || (this.won && !this.keepPlaying);
    }
    // 执行器
    actuate() {
        if (this.storageManager.getBestScore() < this.score) {
            this.storageManager.setBestScore(this.score);
        }

        // Clear the state when the game is over (game over only, not win)
        if (this.over) {
            this.storageManager.clearGameState();
        } else {
            this.storageManager.setGameState(this.serialize());
        }

        this.actuator.actuate(this.grid, {
            score: this.score,
            over: this.over,
            won: this.won,
            bestScore: this.storageManager.getBestScore(),
            terminated: this.isGameTerminated(),
        });
    }
    // 载入数据存起来
    serialize() {
        return {
            grid: this.grid.serialize(),
            score: this.score,
            over: this.over,
            won: this.won,
            // keepPlaying: this.keepPlaying,
        };
    }
}
