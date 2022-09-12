import CanvasBase from "./CanvasBase";
import Resource from "./Resource";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export default class Runner extends CanvasBase {
  private resourceInstance?: Resource;
  private model: tf.Sequential;
  constructor(canvasEle: HTMLCanvasElement) {
    super(canvasEle);
    this.model = this.initModel();
  }

  init() {
    this.resourceInstance = new Resource(this.canvasEle);
  }

  update() {
    const run = () => {
      this.resourceInstance?.update();
      requestAnimationFrame(run);
    };
    run();
  }

  initModel() {
    const model = tf.sequential();
    model.add(
      tf.layers.conv2d({
        inputShape: [512, 800, 1],
        kernelSize: 5,
        filters: 8,
        strides: 2,
        activation: "relu",
        kernelInitializer: "varianceScaling",
      })
    );
    model.add(
      tf.layers.maxPool2d({
        poolSize: [2, 2],
        strides: [2, 2],
      })
    );
    model.add(
      tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: "relu",
        kernelInitializer: "varianceScaling",
      })
    );
    model.add(
      tf.layers.maxPool2d({
        poolSize: [2, 2],
        strides: [2, 2],
      })
    );
    model.add(tf.layers.flatten());
    model.add(
      tf.layers.dense({
        units: 2,
        activation: "softmax",
        kernelInitializer: "varianceScaling",
      })
    );
    model.compile({
      loss: "categoricalCrossentropy",
      optimizer: tf.train.adam(),
      metrics: ["accuracy"],
    });
    return model;
  }
}
