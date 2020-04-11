// 格子.
import Tile from './tile';

export default class Grid {
    constructor(size, previousState) {
        this.size = size;
        this.cells = previousState
            ? this.fromState(previousState)
            : this.empty();
    }
    // 清空16个格子
    empty() {
        var cells = [];

        for (var x = 0; x < this.size; x++) {
            var row = (cells[x] = []);

            for (var y = 0; y < this.size; y++) {
                row.push(null);
            }
        }

        return cells;
    }
    // 恢复之前的状态
    fromState(state) {
        var cells = [];

        for (var x = 0; x < this.size; x++) {
            var row = (cells[x] = []);

            for (var y = 0; y < this.size; y++) {
                var tile = state[x][y];
                row.push(tile ? new Tile(tile.position, tile.value) : null);
            }
        }

        return cells;
    }
    // 找出一个可放置新数据块的格子位置
    randomAvailableCell() {
        var cells = this.availableCells();

        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }
    // 找到所有可以用的格子
    availableCells() {
        var cells = [];

        this.eachCell(function(x, y, tile) {
            if (!tile) {
                cells.push({ x: x, y: y });
            }
        });

        return cells;
    }
    // 遍历每个格子
    eachCell(callback) {
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }
    // 插入数字块
    insertTile(tile) {
        this.cells[tile.x][tile.y] = tile;
    }
    serialize() {
        var cellState = [];

        for (var x = 0; x < this.size; x++) {
            var row = (cellState[x] = []);

            for (var y = 0; y < this.size; y++) {
                row.push(
                    this.cells[x][y] ? this.cells[x][y].serialize() : null
                );
            }
        }

        return {
            size: this.size,
            cells: cellState,
        };
    }
}
