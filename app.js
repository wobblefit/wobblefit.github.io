const imageUpload = document.getElementById('image-upload');
const gridType = document.getElementById('grid-type');
const gridValue = document.getElementById('grid-value');
const applyGrid = document.getElementById('apply-grid');
const downloadGrid = document.getElementById('download-grid');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');

let uploadedImage = new Image();

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

uploadedImage.onload = () => {
  canvas.width = uploadedImage.width;
  canvas.height = uploadedImage.height;
  ctx.drawImage(uploadedImage, 0, 0);
};

applyGrid.addEventListener('click', () => {
  if (!uploadedImage.src) return alert("Please upload an image first.");
  const value = parseFloat(gridValue.value);
  if (isNaN(value) || value <= 0) return alert("Please enter a valid grid value.");

  ctx.drawImage(uploadedImage, 0, 0);
  ctx.strokeStyle = '#000000';
  const { width, height } = canvas;

  if (gridType.value === 'cm') {
    const dpi = 96; // assuming 96 DPI
    const cmToPixels = value * (dpi / 2.54);
    for (let x = cmToPixels; x < width; x += cmToPixels) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = cmToPixels; y < height; y += cmToPixels) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (gridType.value === 'squares') {
    const squareSize = width / value;
    for (let x = squareSize; x < width; x += squareSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = squareSize; y < height; y += squareSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
});

downloadGrid.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'image-with-grid.png';
  link.href = canvas.toDataURL();
  link.click();
});
