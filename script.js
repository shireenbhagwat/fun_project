const actions = document.getElementById("actions");
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");

// YES: go to new page (YES button never moves)
yesBtn.addEventListener("click", () => {
  window.location.href = "yes.html";
});

// NO: jump around inside the actions box when you try to click it
noBtn.addEventListener("mouseenter", moveNo);
noBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); moveNo(); });
noBtn.addEventListener("click", (e) => { e.preventDefault(); moveNo(); });

// mobile: dodge on touch
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNo();
}, { passive: false });

function rectsOverlap(a, b) {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

function moveNo() {
  const areaRect = actions.getBoundingClientRect();
  const yesRect  = yesBtn.getBoundingClientRect();
  const noRect   = noBtn.getBoundingClientRect();

  const noW = noRect.width;
  const noH = noRect.height;

  // Allowed movement bounds inside the actions box
  const pad = 6;
  const minX = pad;
  const maxX = areaRect.width - noW - pad;
  const minY = pad;
  const maxY = areaRect.height - noH - pad;

  // Keep-out zone around YES (so NO never overlaps it)
  const buffer = 12;
  const yesKeepOut = {
    left: yesRect.left - buffer,
    top: yesRect.top - buffer,
    right: yesRect.right + buffer,
    bottom: yesRect.bottom + buffer
  };

  // Try multiple times to find a safe spot
  for (let i = 0; i < 60; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    const candidate = {
      left: areaRect.left + x,
      top: areaRect.top + y,
      right: areaRect.left + x + noW,
      bottom: areaRect.top + y + noH
    };

    if (!rectsOverlap(candidate, yesKeepOut)) {
      noBtn.style.left = `${x}px`;
      noBtn.style.top  = `${y}px`;
      noBtn.style.right = "auto";         // allow left-based placement
      noBtn.style.transform = "none";     // stop the initial centering transform
      return;
    }
  }

  // Fallback: put it in the far-right top corner
  noBtn.style.left = `${maxX}px`;
  noBtn.style.top  = `${minY}px`;
  noBtn.style.right = "auto";
  noBtn.style.transform = "none";
}
