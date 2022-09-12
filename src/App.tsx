import { useMount } from "ahooks";
import { useRef } from "react";
import "./App.css";
import BackImg from "./assets/background.jpg";
import Runner from "./Runner";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runnerRef = useRef<Runner>();
  useMount(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 512;
    const runner = new Runner(canvas);
    runner.init();
    runnerRef.current = runner;
  });
  return (
    <div className="App">
      <img src={BackImg} className="background" />
      <canvas ref={canvasRef} className="canvas"></canvas>
      <button
        onClick={() => {
          runnerRef.current?.update();
        }}
      >
        开始游戏
      </button>
    </div>
  );
}

export default App;
