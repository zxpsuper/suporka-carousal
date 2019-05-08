import { extend } from './tool.js';
class LuckyDraw {
    constructor(userOption) {
        this.option = {
            el: '#app',
            canvasId: 'suporka-luckydraw-canvas',
            width: 500,
            height: 500,
        };
        this.init(userOption);
        console.log(this.option);
    }
    init(userOption) {
        // 合并用户配置
        if (Object.assign) {
            Object.assign(this.option, userOption);
        } else {
            extend(this.option, userOption, true);
        }
        let canvasNode = document.createElement('canvas');
        canvasNode.setAttribute('width', this.option.width);
        canvasNode.setAttribute('height', this.option.height);
        canvasNode.setAttribute('id', this.option.canvasId);
        document.querySelector(this.option.el).appendChild(canvasNode);

        let canvas = document.getElementById(this.option.canvasId),
            context = canvas.getContext('2d'),
            AWARDS_ROW_LEN = 3, // 单行单列的矩形的数量
            AWARDS_TOP_DRAW_LEN = AWARDS_ROW_LEN - 1, // 矩形一共有4个顶点，每个顶点会向后绘制矩形，直到碰到下一个顶点为止，
            // 该变量是每个顶点绘制的方块个数，包括该处在该顶点的方块
            AWARDS_LEN = AWARDS_TOP_DRAW_LEN * 4, // 奖品的总数，从 1 开始
            // ----- 九宫格四个角的序号
            LETF_TOP_POINT = 0,
            RIGHT_TOP_POINT = AWARDS_TOP_DRAW_LEN,
            RIGHT_BOTTOM_POINT = AWARDS_TOP_DRAW_LEN * 2,
            LEFT_BOTTOM_POINT = AWARDS_TOP_DRAW_LEN * 2 + AWARDS_TOP_DRAW_LEN,
            // -----

            SUDOKU_SIZE = context.canvas.width, // 整个九宫格的尺寸
            SUDOKU_ITEM_MARGIN = SUDOKU_SIZE / AWARDS_ROW_LEN / 12, // 每个方块之间的间距
            SUDOKU_ITEM_SIZE =
                SUDOKU_SIZE / AWARDS_ROW_LEN - SUDOKU_ITEM_MARGIN, // 每个方块的尺寸
            SUDOKU_ITEM_TXT_SIZE = `bold ${SUDOKU_ITEM_SIZE *
                0.12}px Helvetica`, // 方块内的字体大小
            SUDOKU_ITEM_RADIUS = 8, // 方块圆角的弧度
            SUDOKU_ITEM_UNACTIVE_COLOR = 'rgb(255, 235, 236)',
            SUDOKU_ITEM_UNACTIVE_TXT_COLOR = 'rgb(48, 44, 43)',
            SUDOKU_ITEM_ACTIVE_COLOR = 'rgb(254, 150, 51)',
            SUDOKU_ITEM_ACTIVE_TXT_COLOR = 'rgb(255, 255, 255)',
            SUDOKU_ITEM_SHADOW_COLOR = 'rgb(255, 193, 200)',
            BUTTON_SIZE =
                SUDOKU_SIZE - (SUDOKU_ITEM_SIZE * 2 + SUDOKU_ITEM_MARGIN * 3),
            BUTTON_TXT_SIZE = `bold ${BUTTON_SIZE * 0.12}px Helvetica`,
            BUTTON_TXT_COLOR = 'rgb(172, 97, 1)',
            BUTTON_COLOR = 'rgb(255, 216, 1)',
            BUTTON_SHADOW_COLOR = 'rgb(253, 177, 1)',
            button_position, // 按钮方块的坐标位置
            positions = [], // 记录了所有奖品方块的位置坐标的数组
            jump_index = Math.floor(Math.random() * AWARDS_LEN), // 抽奖轮跳时的序号，第一次点击产生一个随机数，第二次点击则从当前选中序号开始
            jumping_time, // 正在轮跳的时间
            jumping_total_time, // 轮跳的时间总量，基于 duration 变量加上一个 0~1000 之间的随机数组成
            jumping_change, // 轮跳速率峰值，基于 velocity 变量加上一个 0~3 之间的随机数组成
            is_animate = false, // 动画是否在播放状态
            duration = 4000,
            velocity = 300,
            awards = [
                // 奖品信息
                '30元话费',
                'iphone8',
                '未中奖',
                'Macbook pro',
                'img-http://tse4.mm.bing.net/th?id=OIP.5Oa_ZZeDMu0JOFKu-5NDGADIEs&w=137&h=201&c=7&qlt=90&o=4&dpr=2&pid=1.7',
                '火星一日游',
                '未中奖',
                'img-http://tse2.mm.bing.net/th?id=OIP.lnWeNzoVmFXNZXe4bXh7lQDHEs&w=193&h=291&c=7&qlt=90&o=4&dpr=2&pid=1.7',
            ];
        let data = {
            AWARDS_LEN,
            AWARDS_TOP_DRAW_LEN,
            SUDOKU_ITEM_SIZE,
            SUDOKU_ITEM_MARGIN,
            LETF_TOP_POINT,
            RIGHT_TOP_POINT,
            positions,
            awards,
            RIGHT_BOTTOM_POINT,
            SUDOKU_ITEM_RADIUS,
            SUDOKU_ITEM_TXT_SIZE,
            SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
            SUDOKU_ITEM_UNACTIVE_COLOR,
            SUDOKU_ITEM_SHADOW_COLOR,
            LEFT_BOTTOM_POINT,
            BUTTON_SIZE,
            BUTTON_COLOR,
            BUTTON_SHADOW_COLOR,
            BUTTON_TXT_COLOR,
            BUTTON_TXT_SIZE,
        };
        this.startDraw(context, canvas, data);
    }
    startDraw(context, canvas, data) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < data.AWARDS_LEN; i++) {
            // 最右一块的x坐标
            let max_position =
                data.AWARDS_TOP_DRAW_LEN * data.SUDOKU_ITEM_SIZE +
                data.AWARDS_TOP_DRAW_LEN * data.SUDOKU_ITEM_MARGIN;

            // ----- 左上顶点, 画了上面那行，除了最后一块
            if (i >= data.LETF_TOP_POINT && i < data.RIGHT_TOP_POINT) {
                let x = i * data.SUDOKU_ITEM_SIZE + i * data.SUDOKU_ITEM_MARGIN,
                    y = 0;

                // 记录每一个方块的坐标
                data.positions.push({ x, y });

                // 绘制方块
                this.drawSudokuItem(
                    context,
                    x,
                    y,
                    data.SUDOKU_ITEM_SIZE,
                    data.SUDOKU_ITEM_RADIUS,
                    data.awards[i],
                    data.SUDOKU_ITEM_TXT_SIZE,
                    data.SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                    data.SUDOKU_ITEM_UNACTIVE_COLOR,
                    data.SUDOKU_ITEM_SHADOW_COLOR
                );
            }
            // -----

            // ----- 右上顶点, 画了右面那行，除了最下一块
            if (i >= data.RIGHT_TOP_POINT && i < data.RIGHT_BOTTOM_POINT) {
                let row = Math.abs(data.AWARDS_TOP_DRAW_LEN - i),
                    x = max_position,
                    y =
                        row * data.SUDOKU_ITEM_SIZE +
                        row * data.SUDOKU_ITEM_MARGIN;

                // 记录每一个方块的坐标
                data.positions.push({ x, y });

                // 绘制方块
                this.drawSudokuItem(
                    context,
                    x,
                    y,
                    data.SUDOKU_ITEM_SIZE,
                    data.SUDOKU_ITEM_RADIUS,
                    data.awards[i],
                    data.SUDOKU_ITEM_TXT_SIZE,
                    data.SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                    data.SUDOKU_ITEM_UNACTIVE_COLOR,
                    data.SUDOKU_ITEM_SHADOW_COLOR
                );
            }

            // -----

            // ----- 右下顶点 画了下面那行，除了最左一块
            if (i >= data.RIGHT_BOTTOM_POINT && i < data.LEFT_BOTTOM_POINT) {
                let row = Math.abs(data.AWARDS_TOP_DRAW_LEN * 2 - i),
                    reverse_row = Math.abs(row - data.AWARDS_TOP_DRAW_LEN),
                    x =
                        reverse_row * data.SUDOKU_ITEM_SIZE +
                        reverse_row * data.SUDOKU_ITEM_MARGIN,
                    y = max_position;

                // 记录每一个方块的坐标
                data.positions.push({ x, y });

                // 绘制方块
                this.drawSudokuItem(
                    context,
                    x,
                    y,
                    data.SUDOKU_ITEM_SIZE,
                    data.SUDOKU_ITEM_RADIUS,
                    data.awards[i],
                    data.SUDOKU_ITEM_TXT_SIZE,
                    data.SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                    data.SUDOKU_ITEM_UNACTIVE_COLOR,
                    data.SUDOKU_ITEM_SHADOW_COLOR
                );
            }

            // -----
            // ----- 左上顶点，画了左边那行，除了最上一块
            if (i >= data.LEFT_BOTTOM_POINT) {
                let row = Math.abs(data.AWARDS_TOP_DRAW_LEN * 3 - i),
                    reverse_row = Math.abs(row - data.AWARDS_TOP_DRAW_LEN);
                let x = 0;
                let y =
                    reverse_row * data.SUDOKU_ITEM_SIZE +
                    reverse_row * data.SUDOKU_ITEM_MARGIN;

                // 记录每一个方块的坐标
                data.positions.push({ x, y });

                // 绘制方块
                this.drawSudokuItem(
                    context,
                    x,
                    y,
                    data.SUDOKU_ITEM_SIZE,
                    data.SUDOKU_ITEM_RADIUS,
                    data.awards[i],
                    data.SUDOKU_ITEM_TXT_SIZE,
                    data.SUDOKU_ITEM_UNACTIVE_TXT_COLOR,
                    data.SUDOKU_ITEM_UNACTIVE_COLOR,
                    data.SUDOKU_ITEM_SHADOW_COLOR
                );
            }
            // -----
        }
        console.log(data.positions);

        this.drawButton(context, data); // 绘制按钮
    }
    drawSudokuItem(
        context,
        x,
        y,
        size,
        radius,
        text,
        txtSize,
        txtColor,
        bgColor,
        shadowColor
    ) {
        // ----- ① 绘制方块
        context.save();
        context.fillStyle = bgColor;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
        context.shadowColor = shadowColor;
        context.beginPath();
        this.roundedRect(context, x, y, size, size, radius);
        context.fill();
        context.restore();
        // -----

        // ----- ② 绘制图片与文字
        if (text) {
            if (text.substr(0, 3) === 'img') {
                let textFormat = text.replace('img-', ''),
                    image = new Image();
                image.src = textFormat;

                function drawImage() {
                    context.drawImage(
                        image,
                        x + (size * 0.2) / 2,
                        y + (size * 0.2) / 2,
                        size * 0.8,
                        size * 0.8
                    );
                }

                // ----- 如果图片没有加载，则加载，如已加载，则直接绘制
                if (!image.complete) {
                    image.onload = function(e) {
                        drawImage();
                    };
                } else {
                    drawImage();
                }
                // -----
            } else {
                context.save();
                context.fillStyle = txtColor;
                context.font = txtSize;
                context.translate(
                    x + size / 2 - context.measureText(text).width / 2,
                    y + size / 2 + 6
                );
                context.fillText(text, 0, 0);
                context.restore();
            }
        }
        // -----
    }
    roundedRect(context, cornerX, cornerY, width, height, cornerRadius) {
        if (width > 0) context.moveTo(cornerX + cornerRadius, cornerY);
        else context.moveTo(cornerX - cornerRadius, cornerY);

        context.arcTo(
            cornerX + width,
            cornerY,
            cornerX + width,
            cornerY + height,
            cornerRadius
        );

        context.arcTo(
            cornerX + width,
            cornerY + height,
            cornerX,
            cornerY + height,
            cornerRadius
        );

        context.arcTo(
            cornerX,
            cornerY + height,
            cornerX,
            cornerY,
            cornerRadius
        );

        if (width > 0) {
            context.arcTo(
                cornerX,
                cornerY,
                cornerX + cornerRadius,
                cornerY,
                cornerRadius
            );
        } else {
            context.arcTo(
                cornerX,
                cornerY,
                cornerX - cornerRadius,
                cornerY,
                cornerRadius
            );
        }
    }
    drawButton(context, data) {
        let x = data.SUDOKU_ITEM_SIZE + data.SUDOKU_ITEM_MARGIN,
            y = data.SUDOKU_ITEM_SIZE + data.SUDOKU_ITEM_MARGIN;

        // ----- 绘制背景
        context.save();
        context.fillStyle = data.BUTTON_COLOR;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 0;
        context.shadowColor = data.BUTTON_SHADOW_COLOR;
        context.beginPath();
        this.roundedRect(
            context,
            x,
            y,
            data.BUTTON_SIZE,
            data.BUTTON_SIZE,
            data.SUDOKU_ITEM_RADIUS,
            data.BUTTON_COLOR,
            data.BUTTON_SHADOW_COLOR
        );
        context.fill();
        context.restore();
        // -----

        // ----- 绘制文字
        context.save();
        context.fillStyle = data.BUTTON_TXT_COLOR;
        context.font = data.BUTTON_TXT_SIZE;
        context.translate(
            x +
                data.BUTTON_SIZE / 2 -
                context.measureText('立即抽奖').width / 2,
            y + data.BUTTON_SIZE / 2 + 10
        );
        context.fillText('立即抽奖', 0, 0);
        context.restore();
        // -----

        button_position = { x, y };
    }
}

export default LuckyDraw;
