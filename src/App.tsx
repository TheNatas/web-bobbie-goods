import React, { useRef, useEffect, useState } from 'react';
import './App.css';

interface Point {
  x: number;
  y: number;
}

type Tool = 'pen' | 'bucket';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [
    currentImage, 
    // setCurrentImage
  ] = useState<string>('/images/kitchen-bobbie.jpg');
  const [tool, setTool] = useState<Tool>('pen');

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
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Clear any existing drawing before drawing the background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 400, 400);
    };
    img.src = currentImage;
  }, [currentImage]);

  const getMousePos = (canvas: HTMLCanvasElement, evt: React.MouseEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(evt.clientX - rect.left),
      y: Math.floor(evt.clientY - rect.top)
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (tool === 'bucket') {
      const point = getMousePos(canvas, e);
      bucketFill(point.x, point.y);
      return;
    }

    const point = getMousePos(canvas, e);
    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (e: React.MouseEvent) => {
    if (tool !== 'pen') return;
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
    if (tool !== 'pen') return;
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
    img.crossOrigin = 'anonymous';
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

  /*
  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCurrentImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  */
  // ===== Bucket fill implementation =====
  const hexToRgba = (hex: string): [number, number, number, number] => {
    let value = hex.replace('#', '');
    if (value.length === 3) {
      value = value.split('').map((c) => c + c).join('');
    }
    const r = parseInt(value.substring(0, 2), 16);
    const g = parseInt(value.substring(2, 4), 16);
    const b = parseInt(value.substring(4, 6), 16);
    return [r, g, b, 255];
  };

  const colorsMatch = (
    data: Uint8ClampedArray,
    index: number,
    target: [number, number, number, number],
    tolerance: number
  ): boolean => {
    const dr = data[index] - target[0];
    const dg = data[index + 1] - target[1];
    const db = data[index + 2] - target[2];
    const da = data[index + 3] - target[3];
    // Euclidean distance squared (includes alpha)
    const distSq = dr * dr + dg * dg + db * db + da * da;
    return distSq <= tolerance * tolerance;
  };

  const setPixel = (
    data: Uint8ClampedArray,
    index: number,
    colorRgba: [number, number, number, number]
  ) => {
    data[index] = colorRgba[0];
    data[index + 1] = colorRgba[1];
    data[index + 2] = colorRgba[2];
    data[index + 3] = colorRgba[3];
  };

  const bucketFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let imageData: ImageData;
    try {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch {
      // Canvas tainted (likely external image without CORS)
      alert('Bucket fill is unavailable due to image security (CORS). Try using a local/uploaded image.');
      return;
    }

    const { data, width, height } = imageData;
    const startIndex = (startY * width + startX) * 4;

    const fillColor = hexToRgba(color);
    const startColor: [number, number, number, number] = [
      data[startIndex],
      data[startIndex + 1],
      data[startIndex + 2],
      data[startIndex + 3]
    ];

    // If the clicked color is already (approximately) the fill color, do nothing
    if (colorsMatch(data, startIndex, fillColor, 0)) {
      return;
    }

    const tolerance = 24; // small tolerance to handle anti-aliasing

    const stack: Array<[number, number]> = [];
    stack.push([startX, startY]);

    while (stack.length) {
      const [x, y] = stack.pop() as [number, number];
      let currentX = x;
      let idx = (y * width + currentX) * 4;

      // Move left to find edge of segment
      while (currentX >= 0 && colorsMatch(data, idx, startColor, tolerance)) {
        currentX--;
        idx -= 4;
      }
      currentX++;
      idx += 4;

      let spanUp = false;
      let spanDown = false;

      // Fill to the right, adding spans above/below
      while (
        currentX < width && colorsMatch(data, idx, startColor, tolerance)
      ) {
        setPixel(data, idx, fillColor);

        if (y > 0) {
          const upIdx = ((y - 1) * width + currentX) * 4;
          if (!spanUp && colorsMatch(data, upIdx, startColor, tolerance)) {
            stack.push([currentX, y - 1]);
            spanUp = true;
          } else if (spanUp && !colorsMatch(data, upIdx, startColor, tolerance)) {
            spanUp = false;
          }
        }

        if (y < height - 1) {
          const downIdx = ((y + 1) * width + currentX) * 4;
          if (!spanDown && colorsMatch(data, downIdx, startColor, tolerance)) {
            stack.push([currentX, y + 1]);
            spanDown = true;
          } else if (spanDown && !colorsMatch(data, downIdx, startColor, tolerance)) {
            spanDown = false;
          }
        }

        currentX++;
        idx += 4;
      }
    }

    ctx.putImageData(imageData, 0, 0);
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
              disabled={tool === 'bucket'}
            />
            <span>{brushSize}px</span>
          </div>

          <div className="tool-group">
            <span>Tool:</span>
            <button
              className={`btn ${tool === 'pen' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTool('pen')}
            >
              Pen
            </button>
            <button
              className={`btn ${tool === 'bucket' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTool('bucket')}
            >
              Bucket
            </button>
          </div>

          {/*
          <div className="tool-group">
            <label htmlFor="image-upload">Image:</label>
            <input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
              onChange={handleImageUpload}
            />
          </div>
          */}
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
            <li>Choose Pen to draw freehand, or Bucket to fill an area with the selected color</li>
            <li>Upload a JPG/PNG/SVG image or use the default sample</li>
            <li>Brush size applies to the Pen tool</li>
            <li>Click on a region (white space inside outlines) to use Bucket</li>
            <li>Use the Clear button to start over</li>
            <li>Download your finished artwork!</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;
