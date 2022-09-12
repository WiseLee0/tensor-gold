export default class CanvasBase {
  protected canvasEle: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  constructor(canvasEle: HTMLCanvasElement) {
    this.canvasEle = canvasEle;
    this.ctx = canvasEle.getContext("2d")!;
  }
}
