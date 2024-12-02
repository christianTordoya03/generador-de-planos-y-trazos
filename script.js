const canvas = document.getElementById('designCanvas');
const ctx = canvas.getContext('2d');

let drawingMode = null;
let startX, startY;
let shapes = [];
let isErasing = false;
let isDrawing = false;  // Estado para determinar si estamos dibujando una figura

// Handle touch/mouse events and prevent default mobile behaviors like text selection
function getCoordinates(event) {
  const rect = canvas.getBoundingClientRect();

  // Para eventos táctiles, usamos event.touches
  if (event.touches && event.touches[0]) {
    return {
      x: (event.touches[0].clientX - rect.left) * (canvas.width / rect.width),
      y: (event.touches[0].clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  // Para eventos de mouse, usamos offsetX y offsetY
  if (event.offsetX !== undefined && event.offsetY !== undefined) {
    return {
      x: event.offsetX * (canvas.width / canvas.clientWidth),
      y: event.offsetY * (canvas.height / canvas.clientHeight),
    };
  }

  return { x: 0, y: 0 };
}

// Inicia el dibujo
function startDrawing(e) {
  const { x, y } = getCoordinates(e);
  startX = x;
  startY = y;
  isDrawing = true; // Marcar que estamos dibujando

  if (drawingMode === 'text') {
    const text = prompt('Ingrese el texto:');
    const fontSize = prompt('Tamaño de fuente (px):', '20');
    if (text) {
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(text, startX, startY);
      shapes.push({ type: 'text', x: startX, y: startY, text, fontSize });
    }
  }
}

// Dibuja en el canvas
function handleDraw(e) {
  if (!isDrawing) return; // No dibujar si no estamos en modo de dibujo

  const { x, y } = getCoordinates(e);

  if (drawingMode === 'rectangle') {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas antes de redibujar
    redrawCanvas();  // Redibujar las figuras ya existentes
    ctx.strokeStyle = 'green';  // Color para el rectángulo
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  } else if (drawingMode === 'circle') {
    const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas antes de redibujar
    redrawCanvas();  // Redibujar las figuras ya existentes
    ctx.strokeStyle = 'blue';  // Color para el círculo
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (drawingMode === 'line') {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas antes de redibujar
    redrawCanvas();  // Redibujar las figuras ya existentes
    ctx.strokeStyle = 'red';  // Color para la línea
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

// Redibuja todas las figuras en el canvas
function redrawCanvas() {
  shapes.forEach((shape) => {
    if (shape.type === 'rectangle') {
      ctx.strokeStyle = 'green';
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === 'circle') {
      ctx.strokeStyle = 'blue';
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === 'line') {
      ctx.strokeStyle = 'red';
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

// Finaliza el dibujo y guarda la figura
function finishDrawing() {
  const { x, y } = getCoordinates(event);

  if (drawingMode === 'rectangle') {
    shapes.push({ type: 'rectangle', x: startX, y: startY, width: x - startX, height: y - startY });
  } else if (drawingMode === 'circle') {
    const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
    shapes.push({ type: 'circle', x: startX, y: startY, radius });
  } else if (drawingMode === 'line') {
    shapes.push({ type: 'line', x1: startX, y1: startY, x2: x, y2: y });
  }

  isDrawing = false; // Terminar el dibujo
}

// Inicia los eventos del mouse y táctiles
canvas.addEventListener('mousedown', (e) => {
  startDrawing(e);
  canvas.addEventListener('mousemove', handleDraw);
});

canvas.addEventListener('touchstart', (e) => {
  startDrawing(e);
  canvas.addEventListener('touchmove', handleDraw);
  e.preventDefault(); // Para prevenir el comportamiento de selección de texto en móviles
});

canvas.addEventListener('mouseup', () => {
  finishDrawing();
  canvas.removeEventListener('mousemove', handleDraw);
});

canvas.addEventListener('touchend', () => {
  finishDrawing();
  canvas.removeEventListener('touchmove', handleDraw);
});

// Herramientas
document.getElementById('drawRectangle').addEventListener('click', () => {
  drawingMode = 'rectangle';
  isErasing = false;
  resetButtonColors();  // Resetear los colores de los botones
  document.getElementById('drawRectangle').style.backgroundColor = 'green'; // Color activo
});

document.getElementById('drawCircle').addEventListener('click', () => {
  drawingMode = 'circle';
  isErasing = false;
  resetButtonColors();  // Resetear los colores de los botones
  document.getElementById('drawCircle').style.backgroundColor = 'blue'; // Color activo
});

document.getElementById('drawLine').addEventListener('click', () => {
  drawingMode = 'line';
  isErasing = false;
  resetButtonColors();  // Resetear los colores de los botones
  document.getElementById('drawLine').style.backgroundColor = 'red'; // Color activo
});

document.getElementById('addText').addEventListener('click', () => {
  drawingMode = 'text';
  isErasing = false;
  resetButtonColors();  // Resetear los colores de los botones
  document.getElementById('addText').style.backgroundColor = 'purple'; // Color activo
});

document.getElementById('erase').addEventListener('click', () => {
  drawingMode = null;
  isErasing = true;
  resetButtonColors();  // Resetear los colores de los botones
});

document.getElementById('clearCanvas').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes = [];
});

document.getElementById('exportImage').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'design.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Resetear el color de fondo de los botones
function resetButtonColors() {
  const buttons = document.querySelectorAll('.toolbar button');
  buttons.forEach(button => {
    button.style.backgroundColor = '#4CAF50'; // Color predeterminado
  });
}
