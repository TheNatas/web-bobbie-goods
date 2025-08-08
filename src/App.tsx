import React, { useRef, useEffect, useState } from 'react';
import './App.css';

interface Point {
  x: number;
  y: number;
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const currentImage = '/images/sample-bobbie.svg';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Load and draw the background image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 400, 400);
    };
    img.src = currentImage;
  }, [currentImage]);

  const getMousePos = (canvas: HTMLCanvasElement, evt: React.MouseEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getMousePos(canvas, e);
    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getMousePos(canvas, e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the background image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 400, 400);
    };
    img.src = currentImage;
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'bobbie-colored.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bobbie Goods Coloring</h1>
      </header>
      
      <main className="app-main">
        <div className="toolbar">
          <div className="tool-group">
            <label htmlFor="color-picker">Color:</label>
            <input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          
          <div className="tool-group">
            <label htmlFor="brush-size">Brush Size:</label>
            <input
              id="brush-size"
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
            <span>{brushSize}px</span>
          </div>
          
          <div className="tool-group">
            <button onClick={clearCanvas} className="btn btn-secondary">
              Clear
            </button>
            <button onClick={downloadImage} className="btn btn-primary">
              Download
            </button>
          </div>
        </div>
        
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="drawing-canvas"
          />
        </div>
        
        <div className="instructions">
          <h3>How to use:</h3>
          <ul>
            <li>Choose your color using the color picker</li>
            <li>Adjust brush size with the slider</li>
            <li>Click and drag to paint on the bobbie goods</li>
            <li>Use the Clear button to start over</li>
            <li>Download your finished artwork!</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;
