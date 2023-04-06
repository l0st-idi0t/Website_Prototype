const clock = document.getElementById('clock');
const folder = document.getElementById('portfolio-folder');
let clicks = 0;
let isDragging = false;
let dragOffset = {x: 0, y: 0};
let folderOffset = {x: 0, y: 0};
let folderSize = {width: folder.offsetWidth, height: folder.offsetHeight};
let ghostFolder = null;

//selection box
let selectionBox = null;
let startSelection = false;
let startX, startY;
let intersect = false;

//hehe you don't get to select any text
document.body.style.userSelect = 'none';

// ---- selection box code ----
document.addEventListener('mousedown', (event) => {
  startSelection = true;
  startX = event.clientX;
  startY = event.clientY;
  selectionBox = document.createElement('div');
  selectionBox.classList.add('selection-box');
  document.body.appendChild(selectionBox);
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    startSelection = false;
    intersect = false;
  }

  if (startSelection) {
    const x = Math.min(startX, event.clientX);
    const y = Math.min(startY, event.clientY);
    const width = Math.abs(startX - event.clientX);
    const height = Math.abs(startY - event.clientY);

    selectionBox.style.left = `${x}px`;
    selectionBox.style.top = `${y}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;

    // Check if the folder intersects with the selection box
    const folderRect = folder.getBoundingClientRect();
    const selectionBoxRect = selectionBox.getBoundingClientRect();
    intersect = !(folderRect.right < selectionBoxRect.left || 
                        folderRect.left > selectionBoxRect.right || 
                        folderRect.bottom < selectionBoxRect.top || 
                        folderRect.top > selectionBoxRect.bottom);

    if (intersect) {
      folder.classList.add('selected');
    }
  }
  
});

document.addEventListener('mouseup', () => {
  startSelection = false;
  if (selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }
});
// ---- selection box code ----

// ---- folder code ----
folder.addEventListener('click', () => {
  clicks++;
  if (clicks == 2) {
      clicks = 0;
      //something
  } else {
      folder.classList.add('selected');
  }
});

document.addEventListener('click', (event) => {
  if (!folder.contains(event.target)) {
    folder.classList.remove('selected');
    clicks = 0;
  }
  
  if (intersect) {
    folder.classList.add('selected');
    intersect = false;
  }
});

folder.addEventListener('dragstart', (event) => {
  isDragging = true;
  dragOffset.x = event.clientX;
  dragOffset.y = event.clientY;
  folderOffset.x = folder.offsetLeft;
  folderOffset.y = folder.offsetTop;

  // Create a ghost folder with the same size as the original folder
  ghostFolder = document.createElement('div');
  ghostFolder.classList.add('folder', 'ghost');
  ghostFolder.style.width = folderSize.width + 'px';
  ghostFolder.style.height = folderSize.height + 'px';
  ghostFolder.style.top = folderOffset.y + 'px';
  ghostFolder.style.left = folderOffset.x + 'px';
  document.body.appendChild(ghostFolder);
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    startSelection = false;
    // Move the ghost folder with the mouse
    ghostFolder.style.top = folderOffset.y + event.clientY - dragOffset.y + 'px';
    ghostFolder.style.left = folderOffset.x + event.clientX - dragOffset.x + 'px';
  }
});

document.addEventListener('mouseup', (event) => {
  if (isDragging) {
    // Remove the ghost folder
    ghostFolder.parentNode.removeChild(ghostFolder);
    
    // Move the original folder to the final position
    folder.style.top = folderOffset.y + event.clientY - dragOffset.y + 'px';
    folder.style.left = folderOffset.x + event.clientX - dragOffset.x + 'px';
    
    isDragging = false;
  }
});
// ---- folder code ----

// ---- clock code ----
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function updateClock() {
  let now = new Date();
  clock.innerHTML = formatAMPM(now);
}

setInterval(updateClock, 500);
// ---- clock code ----