// 格子上的数据块
export default class Tile {
    constructor(position, value) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2;

        this.previousPosition = null;
        this.mergedFrom = null; // Tracks tiles that merged together
    }
    savePosition() {
        this.previousPosition = { x: this.x, y: this.y };
    }
    updatePosition(position) {
        this.x = position.x;
        this.y = position.y;
    }
    // 载入数据
    serialize() {
        return {
            position: {
                x: this.x,
                y: this.y,
            },
            value: this.value,
        };
    }
}
