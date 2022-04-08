const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const canvasDimensions = { x: 350, y: 350 };
const pixelDivisor = 50;
const pixelDimensions = {
  width: canvasDimensions.x / pixelDivisor,
  height: canvasDimensions.y / pixelDivisor,
};
const pixelsPerRow = pixelsHorizontally();
const pixelsPerColumn = pixelsVertically();
const pixelsOnScreen = TotalOfPixels();

const recalculateFireDelay = 50;

const firePixelData = [];
const fireColorsPalette = [
  { r: 7, g: 7, b: 7 },
  { r: 31, g: 7, b: 7 },
  { r: 47, g: 15, b: 7 },
  { r: 71, g: 15, b: 7 },
  { r: 87, g: 23, b: 7 },
  { r: 103, g: 31, b: 7 },
  { r: 119, g: 31, b: 7 },
  { r: 143, g: 39, b: 7 },
  { r: 159, g: 47, b: 7 },
  { r: 175, g: 63, b: 7 },
  { r: 191, g: 71, b: 7 },
  { r: 199, g: 71, b: 7 },
  { r: 223, g: 79, b: 7 },
  { r: 223, g: 87, b: 7 },
  { r: 223, g: 87, b: 7 },
  { r: 215, g: 95, b: 7 },
  { r: 215, g: 95, b: 7 },
  { r: 215, g: 103, b: 15 },
  { r: 207, g: 111, b: 15 },
  { r: 207, g: 119, b: 15 },
  { r: 207, g: 127, b: 15 },
  { r: 207, g: 135, b: 23 },
  { r: 199, g: 135, b: 23 },
  { r: 199, g: 143, b: 23 },
  { r: 199, g: 151, b: 31 },
  { r: 191, g: 159, b: 31 },
  { r: 191, g: 159, b: 31 },
  { r: 191, g: 167, b: 39 },
  { r: 191, g: 167, b: 39 },
  { r: 191, g: 175, b: 47 },
  { r: 183, g: 175, b: 47 },
  { r: 183, g: 183, b: 47 },
  { r: 183, g: 183, b: 55 },
  { r: 207, g: 207, b: 111 },
  { r: 223, g: 223, b: 159 },
  { r: 239, g: 239, b: 199 },
  { r: 255, g: 255, b: 255 },
];

function resizeCanvas() {
  canvas.width = canvasDimensions.x;
  canvas.height = canvasDimensions.y;
}

function pixelsHorizontally() {
  return canvasDimensions.x / pixelDimensions.width;
}

function pixelsVertically() {
  return canvasDimensions.y / pixelDimensions.height;
}

function TotalOfPixels() {
  return pixelsHorizontally() * pixelsVertically();
}

function clearScreen() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvasDimensions.x, canvasDimensions.y);
}

function drawPixel(position, color) {
  const colorString = `rgb(${color.r},${color.g},${color.b})`;
  context.fillStyle = colorString;
  context.fillRect(
    position.x,
    position.y,
    pixelDimensions.width,
    pixelDimensions.height
  );
}

function createFireDataStructure() {
  const numberOfPixels = TotalOfPixels();
  for (let i = 0; i < numberOfPixels; i++) {
    firePixelData[i] = 0;
  }
}

function createFireSource() {
  for (let column = 0; column < pixelsPerRow; column++) {
    const overflowPixelIndex = pixelsPerRow * pixelsPerColumn;
    const pixelIndex = overflowPixelIndex - pixelsPerRow + column;
    const decay = Math.floor(Math.random() * 1);
    firePixelData[pixelIndex] = fireColorsPalette.length - 1 - decay;
  }
}

function calculateFirePropagation() {
  for (let column = 0; column < pixelsPerColumn; column++) {
    for (let row = 0; row < pixelsPerRow; row++) {
      const pixelIndex = column + pixelsPerColumn * row;
      updateFireIntensityPerPixel(pixelIndex);
    }
  }
}

function updateFireIntensityPerPixel(currentPixelIndex) {
  const bellowPixelIndex = currentPixelIndex + pixelsPerColumn;
  if (bellowPixelIndex >= pixelsOnScreen) {
    return;
  }
  const decay = Math.floor(Math.random() * 3);
  const bellowPixelFireIntensity = firePixelData[bellowPixelIndex];
  const newFireIntensity =
    bellowPixelFireIntensity - decay >= 0
      ? bellowPixelFireIntensity - decay
      : 0;
  firePixelData[currentPixelIndex - decay] = newFireIntensity;
}

function renderScreen() {
  clearScreen();

  for (let row = 0; row < pixelsPerRow; row++) {
    for (let column = 0; column < pixelsPerColumn; column++) {
      const pixelIndex = pixelsPerColumn * row + column;
      const fireIntensity = firePixelData[pixelIndex];
      const color = fireColorsPalette[fireIntensity];

      const position = {
        x: column * pixelDimensions.width,
        y: row * pixelDimensions.height,
      };

      drawPixel(position, color);
    }
  }

  window.requestAnimationFrame(renderScreen);
}

function start() {
  resizeCanvas();

  createFireDataStructure();
  createFireSource();

  setInterval(calculateFirePropagation, recalculateFireDelay);

  renderScreen();
}

start();
