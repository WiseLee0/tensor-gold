import CanvasBase from "./CanvasBase";
import AtlasImg from "./assets/atlas.png";
import {
  getCirclePos,
  degressToRads,
  isRectIntersect,
  isPassRect,
} from "./utils";
type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};
type HooksPos = {
  x: number;
  y: number;
  deg: number;
};
export default class Resource extends CanvasBase {
  private img?: HTMLImageElement;
  private rotateDeg: number = 90;
  private rotateRate: number = 0.3;
  private hooks: HooksPos = { x: 380, y: 62, deg: 90 };
  golds: Position[] = [];
  stones: Position[] = [];

  constructor(canvasEle: HTMLCanvasElement) {
    super(canvasEle);
    this.initDraw();
    this.updateDraw();
  }
  // 判断是否可以抓取
  checkPass() {
    let selectGlod: Position | undefined = undefined;
    for (let i = 0; i < this.golds.length; i++) {
      const item = this.golds[i];
      if (isPassRect(item, this.hooks.x, this.hooks.y, this.rotateDeg)) {
        selectGlod = item;
        break;
      }
    }
    if (!selectGlod) return false;
    for (let i = 0; i < this.stones.length; i++) {
      const item = this.stones[i];
      if (
        isPassRect(item, this.hooks.x, this.hooks.y, this.rotateDeg) &&
        item.y < selectGlod.y
      ) {
        return false;
      }
    }
    return true;
  }
  update() {
    if (this.rotateDeg >= 160) {
      this.rotateRate = -Math.abs(this.rotateRate);
    } else if (this.rotateDeg <= 20) {
      this.rotateRate = Math.abs(this.rotateRate);
    }
    this.rotateDeg += this.rotateRate;
    this.setHooks(this.rotateDeg);
    this.updateDraw();
    if (this.checkPass()) {
    }
  }
  private updateDraw() {
    this.ctx.clearRect(0, 0, this.canvasEle.width, this.canvasEle.height);
    const img = this.img!;
    this.drawAvatar(img);
    this.drawHook(img);
    this.golds.forEach((item) => {
      this.drawGold(img, item.x, item.y);
    });
    this.stones.forEach((item) => {
      this.drawStone(img, item.x, item.y);
    });
    this.golds.forEach((item) => {
      this.drawGold(img, item.x, item.y);
    });
  }
  private initDraw() {
    this.setHooks(90);
    if (this.img) {
      this._drawResource();
      return;
    }
    const img = new Image();
    img.src = AtlasImg;
    this.img = img;
    img.onload = () => {
      this._drawResource();
    };
  }

  private _drawResource() {
    const img = this.img!;
    this.drawAvatar(img);
    this.generate(4, (x, y) => {
      this.drawGold(img, x, y);
      this.golds.push({ x, y, w: 72, h: 67 });
    });
    this.generate(3, (x, y) => {
      this.drawStone(img, x, y);
      this.stones.push({ x, y, w: 45, h: 40 });
    });
    this.drawHook(img);
  }

  private drawAvatar(img: CanvasImageSource) {
    this.ctx.drawImage(img, 200, 1105, 67, 67, 360, 0, 67, 67);
  }
  private drawGold(img: CanvasImageSource, x: number, y: number) {
    this.ctx.drawImage(img, 399, 1083, 72, 67, x, y, 72, 67);
  }
  private drawStone(img: CanvasImageSource, x: number, y: number) {
    this.ctx.drawImage(img, 353, 1092, 45, 40, x, y, 45, 40);
  }
  private drawHook(img: CanvasImageSource) {
    const { x, y, deg } = this.hooks;
    this.drawLine(x, y);
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(degressToRads(deg));
    this.ctx.drawImage(img, 989, 759, 45, 16, -12, -5, 45, 16);
    this.ctx.restore();
  }
  private drawLine(x: number, y: number) {
    this.ctx.save();
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.lineTo(380, 40);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
  private drawExtendsLine(color = "#fff") {
    const [x, y] = getCirclePos({
      x: 380,
      y: 40,
      deg: this.rotateDeg,
      r: 500,
    });
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.lineTo(380, 40);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
  private isExist(x: number, y: number) {
    const ans = [...this.golds, ...this.stones];
    for (const item of ans) {
      if (isRectIntersect(item, { x, y, w: 72, h: 72 })) return true;
    }
    return false;
  }
  private generate(num: number, cb: (x: number, y: number) => void) {
    const top = 150;
    const bottom = this.canvasEle.height - top;
    const left = 0;
    const right = this.canvasEle.width - 100;
    for (let i = 0; i < num; i++) {
      const x = left + Math.floor(Math.random() * (right - left));
      const y = top + Math.floor(Math.random() * (bottom - top));
      if (!this.isExist(x, y)) {
        cb(x, y);
      }
    }
  }
  private setHooks(deg: number, r = 22) {
    const [x, y] = getCirclePos({
      x: 380,
      y: 40,
      deg: this.rotateDeg,
      r,
    });
    this.hooks = { x, y, deg };
  }
}
