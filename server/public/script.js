const loadButton = document.getElementById("loadButton");
const toggleButton = document.getElementById("toggleButton");
const urlInput = document.getElementById("urlInput");
const iframe = document.getElementById("iframe");
const overlayImage = document.getElementById("overlayImage");
const opacitySlider = document.getElementById("opacitySlider");
const imageUpload = document.getElementById("imageUpload");
const interactionToggle = document.getElementById("interactionToggle");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let iframeInteractive = false;

// ✨ Apply opacity to both iframe and image
opacitySlider.addEventListener("input", () => {
  overlayImage.style.opacity = opacitySlider.value;
  iframe.style.opacity = opacitySlider.value;
});

// ✅ Toggle iframe interactivity (via pointer-events)
interactionToggle.addEventListener("click", () => {
  iframeInteractive = !iframeInteractive;
  iframe.style.pointerEvents = iframeInteractive ? "auto" : "none";
  interactionToggle.innerText = iframeInteractive
    ? "Disable Website Interaction"
    : "Enable Website Interaction";
});

// 🚀 Load the iframe or fallback to screenshot
loadButton.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url.startsWith("http")) {
    alert("Please enter a valid URL starting with http or https.");
    return;
  }

  iframe.src = url;
  iframe.style.display = "block";
  iframe.style.opacity = opacitySlider.value;
  iframe.style.pointerEvents = iframeInteractive ? "auto" : "none";
  overlayImage.style.display = "none";
});

// 🧱 Screenshot fallback
async function fallbackToScreenshot(url) {
  try {
    const res = await fetch(
      `http://localhost:3001/screenshot?url=${encodeURIComponent(url)}`
    );
    if (!res.ok) throw new Error("Screenshot API failed");
    const blob = await res.blob();
    const imgURL = URL.createObjectURL(blob);

    overlayImage.src = imgURL;
    overlayImage.style.display = "block";
    overlayImage.style.opacity = opacitySlider.value;
    iframe.style.display = "none";
  } catch (err) {
    alert("Failed to load iframe or screenshot.");
    console.error(err);
  }
}

// 🧼 Toggle image overlay visibility
toggleButton.addEventListener("click", () => {
  const isVisible =
    overlayImage.style.display !== "none" || iframe.style.display !== "none";

  overlayImage.style.display = isVisible ? "none" : "block";
  iframe.style.display = isVisible ? "none" : "block";
});

// 🎯 Upload your own image screenshot
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    overlayImage.src = event.target.result;
    overlayImage.style.display = "block";
    overlayImage.style.left = "0px";
    overlayImage.style.top = "0px";
    iframe.style.display = "none";
  };
  reader.readAsDataURL(file);
});

// 🖱️ Drag-to-move overlay image
overlayImage.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - overlayImage.offsetLeft;
  offsetY = e.clientY - overlayImage.offsetTop;
});
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    overlayImage.style.left = `${e.clientX - offsetX}px`;
    overlayImage.style.top = `${e.clientY - offsetY}px`;
  }
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});

const moveButtons = document.querySelectorAll("#screenshotControls button");
let moveStep = 2; // pixels per button press

moveButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const direction = btn.dataset.move;
    const currentTop = parseInt(overlayImage.style.top || 0, 10);
    const currentLeft = parseInt(overlayImage.style.left || 0, 10);

    switch (direction) {
      case "up":
        overlayImage.style.top = `${currentTop - moveStep}px`;
        break;
      case "down":
        overlayImage.style.top = `${currentTop + moveStep}px`;
        break;
      case "left":
        overlayImage.style.left = `${currentLeft - moveStep}px`;
        break;
      case "right":
        overlayImage.style.left = `${currentLeft + moveStep}px`;
        break;
    }
  });
});
const removeScreenshotButton = document.getElementById(
  "removeScreenshotButton"
);

removeScreenshotButton.addEventListener("click", () => {
  overlayImage.src = "";
});
