// script.js
const canvas = document.getElementById('designCanvas');
const ctx = canvas.getContext('2d');

let drawingMode = null;
let startX, startY;
let shapes = []; // Store shapes for erasing and redrawing
let isErasing = false;

// Tools
document.getElementById('drawRectangle').addEventListener('click', () => {
  drawingMode = 'rectangle';
  isErasing = false;
});

document.getElementById('drawCircle').addEventListener('click', () => {
  drawingMode = 'circle';
  isErasing = false;
});

document.getElementById('drawLine').addEventListener('click', () => {
  drawingMode = 'line';
  isErasing = false;
});

document.getElementById('addText').addEventListener('click', () => {
  drawingMode = 'text';
  isErasing = false;
});

document.getElementById('erase').addEventListener('click', () => {
  drawingMode = null;
  isErasing = true;
});

document.getElementById('clearCanvas').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes = [];
});

canvas.addEventListener('mousedown', (e) => {
  startX = e.offsetX;
  startY = e.offsetY;

  if (drawingMode === 'text') {
    const text = prompt('Ingrese el texto:');
    const fontSize = prompt('Tamaño de fuente (px):', '20');
    if (text) {
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(text, startX, startY);
      shapes.push({ type: 'text', x: startX, y: startY, text, fontSize });
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  const endX = e.offsetX;
  const endY = e.offsetY;

  if (drawingMode === 'rectangle') {
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    shapes.push({ type: 'rectangle', x: startX, y: startY, width: endX - startX, height: endY - startY });
  } else if (drawingMode === 'circle') {
    const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
    shapes.push({ type: 'circle', x: startX, y: startY, radius });
  } else if (drawingMode === 'line') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    shapes.push({ type: 'line', x1: startX, y1: startY, x2: endX, y2: endY });
  } else if (isErasing) {
    shapes = shapes.filter((shape) => {
      if (
        shape.type === 'rectangle' &&
        startX >= shape.x &&
        startX <= shape.x + shape.width &&
        startY >= shape.y &&
        startY <= shape.y + shape.height
      ) {
        return false;
      }
      if (
        shape.type === 'circle' &&
        Math.sqrt((startX - shape.x) ** 2 + (startY - shape.y) ** 2) <= shape.radius
      ) {
        return false;
      }
      return true;
    });
    redrawCanvas();
  }
});

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach((shape) => {
    if (shape.type === 'rectangle') {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    } else if (shape.type === 'text') {
      ctx.font = `${shape.fontSize}px Arial`;
      ctx.fillText(shape.text, shape.x, shape.y);
    }
  });
}

document.getElementById('exportImage').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'PrimeHomeworks.png';
  link.href = canvas.toDataURL();
  link.click();
});
