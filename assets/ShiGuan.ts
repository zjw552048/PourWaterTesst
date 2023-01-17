import { _decorator, Component, Node, Color, Graphics, UITransform, math, clamp } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('ShiGuan') @executeInEditMode
export class ShiGuan extends Component {
    @property(Graphics)
    private drawGraphics: Graphics;

    @property(UITransform)
    private shiGuanUITransform: UITransform;

    private color1: Color = Color.YELLOW;
    private color2: Color = Color.RED;
    private color3: Color = Color.GREEN;

    private bottleWidth: number;
    private bottleHeight: number;

    public start() {
        this.bottleWidth = this.shiGuanUITransform.contentSize.x
        this.bottleHeight = this.shiGuanUITransform.contentSize.y;
    }

    public update() {
        this.drawGraphics.clear();
        this.fixAngle();
        this.myDraw(this.node.angle, 300, this.color3);
        this.myDraw(this.node.angle, 200, this.color2);
        this.myDraw(this.node.angle, 100, this.color1);
        // this.drawOneWater(this.node.angle, 100, this.color3);
        // this.drawOneWater(this.node.angle, 200, this.color2);
        // this.drawOneWater(this.node.angle, 100, this.color1);
    }

    private fixAngle() {
        if (this.node.angle > 90) {
            this.node.angle = 90;
        } else if (this.node.angle < -90) {
            this.node.angle = -90;
        }
    }

    private myDraw(angle: number, h: number, color: Color) {
        this.drawGraphics.fillColor = color;

        var keyRadians = Math.atan(2 * h / this.bottleWidth);
        var keyL = this.bottleWidth * Math.tan(keyRadians);
        // console.log("keyAngle", math.toDegree(keyRadians), "keyL: ", keyL);
        var curRadians = math.toRadian(angle);
        var tanValue = Math.tan(curRadians);
        if (Math.abs(math.toRadian(angle)) > keyRadians) {
            // 三角形的情况下，L为左或右边垂直于瓶底的高度，B为液体在瓶底的宽度
            if (angle > 0) {
                var L = Math.sqrt(2 * this.bottleWidth * h * tanValue);
                var B = L / tanValue;
                // 注意，要先计算B在限制L，否则B会在临界值有一个跳跃
                L = clamp(L, 0, this.bottleHeight);
                this.drawGraphics.moveTo(0, 0);
                this.drawGraphics.lineTo(0, L);
                this.drawGraphics.lineTo(B, 0);
            } else {
                var L = Math.sqrt(-2 * this.bottleWidth * h * tanValue);
                var B = -L / tanValue;
                // 注意，要先计算B在限制L，否则B会在临界值有一个跳跃
                L = clamp(L, 0, this.bottleHeight);
                this.drawGraphics.moveTo(this.bottleWidth - B, 0);
                this.drawGraphics.lineTo(this.bottleWidth, L);
                this.drawGraphics.lineTo(this.bottleWidth, 0);
            }
        } else {
            // 梯形的情况下， L1为左边垂直于瓶底的高度，L2为右边垂直于瓶底的高度
            var L1 = h + tanValue * this.bottleWidth / 2;
            var L2 = h - tanValue * this.bottleWidth / 2;
            L1 = clamp(L1, 0, this.bottleHeight);
            L2 = clamp(L2, 0, this.bottleHeight);

            this.drawGraphics.moveTo(0, 0);
            this.drawGraphics.lineTo(0, L1);
            this.drawGraphics.lineTo(this.bottleWidth, L2);
            this.drawGraphics.lineTo(this.bottleWidth, 0);
        }
        this.drawGraphics.fill();
    }

    private drawOneWater(angle: number, height: number, color: Color) {
        const radiansA = angle / 180 * Math.PI;
        //计算临界角度
        const radiansM = Math.atan(2 * height / this.bottleWidth);
        const tempWTan = this.bottleWidth * Math.tan(radiansA);
        this.drawGraphics.fillColor = color;
        if (radiansA <= radiansM) {
            if (radiansA < -radiansM) {
                // 三角形 逆时针
                let hL = Math.sqrt(2 * height * -tempWTan);
                // 超出高度处理
                hL = hL > this.bottleHeight ? this.bottleHeight : hL;
                const bW = hL / Math.tan(-radiansA);
                this.drawGraphics.moveTo(this.bottleWidth, 0);
                this.drawGraphics.lineTo(this.bottleWidth, hL);
                this.drawGraphics.lineTo(this.bottleWidth - bW, 0);
                this.drawGraphics.lineTo(this.bottleWidth, 0);
            } else {
                // 梯形，包含顺逆时针
                this.drawGraphics.moveTo(0, 0);
                let hL = height + tempWTan / 2;
                // 超出高度处理
                let cutOffset = 0;
                if (hL > this.bottleHeight) {
                    cutOffset += hL - this.bottleHeight
                }
                let hR = height - tempWTan / 2;
                if (hR > this.bottleHeight) {
                    cutOffset += hR - this.bottleHeight
                }

                this.drawGraphics.lineTo(this.bottleWidth, 0);
                this.drawGraphics.lineTo(this.bottleWidth, hR - cutOffset);
                this.drawGraphics.lineTo(0, hL - cutOffset);
                this.drawGraphics.lineTo(0, 0);
            }
        } else {
            // 三角形 顺时针
            let hL = Math.sqrt(2 * height * tempWTan);
            // 超出高度处理
            hL = hL > this.bottleHeight ? this.bottleHeight : hL;
            const bW = hL / Math.tan(radiansA);
            this.drawGraphics.moveTo(0, 0);
            this.drawGraphics.lineTo(bW, 0);
            this.drawGraphics.lineTo(0, hL);
            this.drawGraphics.lineTo(0, 0);
        }
        this.drawGraphics.fill();
    }
}


