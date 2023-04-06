const clock = document.getElementById('clock');
const folder = document.getElementById('portfolio-folder');
let clicks = 0;
let isDragging = false;
let dragOffset = {x: 0, y: 0};
let folderOffset = {x: 0, y: 0};
let folderSize = {width: folder.offsetWidth, height: folder.offsetHeight};
let ghostFolder = null;

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
});

folder.addEventListener('mousedown', (event) => {
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
    
    // Disable text selection while dragging
    document.body.style.userSelect = 'none';
  });
  
  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      // Move the ghost folder with the mouse
      ghostFolder.style.top = folderOffset.y + event.clientY - dragOffset.y + 'px';
      ghostFolder.style.left = folderOffset.x + event.clientX - dragOffset.x + 'px';
    }
  });
  
  document.addEventListener('mouseup', (event) => {
    if (isDragging) {
      // Remove the ghost folder
      ghostFolder.parentNode.removeChild(ghostFolder);
      
      // Enable text selection
      document.body.style.userSelect = 'auto';
      
      // Move the original folder to the final position
      folder.style.top = folderOffset.y + event.clientY - dragOffset.y + 'px';
      folder.style.left = folderOffset.x + event.clientX - dragOffset.x + 'px';
      
      isDragging = false;
    }
  });

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
