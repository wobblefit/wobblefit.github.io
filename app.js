const imageUpload = document.getElementById('image-upload');
const gridType = document.getElementById('grid-type');
const gridValue = document.getElementById('grid-value');
const applyGrid = document.getElementById('apply-grid');
const downloadGrid = document.getElementById('download-grid');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');
const cropContainer = document.getElementById('crop-container');
const cropImage = document.getElementById('crop-image');
let cropper, uploadedImage;

// Handle image upload
imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      cropContainer.style.display = 'block'; // Show cropping interface
      canvas.style.display = 'none'; // Hide canvas initially
      cropImage.src = e.target.result;

      // Initialize Cropper.js
      cropper = new Cropper(cropImage, {
        aspectRatio: NaN, // Free aspect ratio
        viewMode: 1,
        autoCropArea: 1,
      });
    };
    reader.readAsDataURL(file);
  }
});

// Apply cropping
document.getElementById('crop-apply').addEventListener('click', () => {
  const croppedCanvas = cropper.getCroppedCanvas();

  // Update the main canvas with cropped image
  canvas.width = croppedCanvas.width;
  canvas.height = croppedCanvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(croppedCanvas, 0, 0);

  // Cleanup and reset UI
  cropContainer.style.display = 'none';
  canvas.style.display = 'block';
  uploadedImage = croppedCanvas.toDataURL(); // Save cropped image data
  cropper.destroy();
});

// Cancel cropping
document.getElementById('crop-cancel').addEventListener('click', () => {
  cropContainer.style.display = 'none';
  canvas.style.display = 'block';
  cropper.destroy();
});

// Apply grid overlay
applyGrid.addEventListener('click', () => {
  if (!uploadedImage) return alert("Please crop or upload an image first.");
  const value = parseFloat(gridValue.value);
  if (isNaN(value) || value <= 0) return alert("Please enter a valid grid value.");

  // Reset canvas to cropped image before applying grid
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    ctx.strokeStyle = '#000000'; // Set grid line color
    const { width, height } = canvas;

    if (gridType.value === 'cm') {
      const dpi = 96; // Assuming 96 DPI
      const cmToPixels = value * (dpi / 2.54); // Convert cm to pixels
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
      const squareSize = width / value; // Determine square size based on input
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
  };
  img.src = uploadedImage;
});

// Download the image with grid
downloadGrid.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'image-with-grid.png';
  link.href = canvas.toDataURL(); // Convert canvas content to data URL
  link.click();
});
