const clock = document.getElementById('clock');
const folder = document.getElementById('portfolio-folder');
const info = document.querySelector('.info');
const closeBtn = document.getElementById('close');
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let folderOffset = { x: 0, y: 0 };
let folderSize = { width: folder.offsetWidth, height: folder.offsetHeight };
let ghostFolder = null;

//selection box
const selectionBox = document.createElement('div');
selectionBox.classList.add('selection-box');
document.body.appendChild(selectionBox);
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

document.addEventListener('mouseup', (event) => {
  startSelection = false;
  // reset selection box
  selectionBox.style.left = 0;
  selectionBox.style.top = 0;
  selectionBox.style.width = 0;
  selectionBox.style.height = 0;
  event.preventDefault();
});
// ---- selection box code ----

// ---- folder code ----
folder.addEventListener('click', (event) => {
  folder.classList.add('selected');
  event.preventDefault();
});

folder.addEventListener('dblclick', (event) => {
  folder.classList.remove('selected');
  info.style.transform = 'translate(-50%, -50%) scale(1)';
  event.preventDefault();
});

document.addEventListener('click', (event) => {
  if (!folder.contains(event.target)) {
    folder.classList.remove('selected');
  }
  
  if (intersect) {
    folder.classList.add('selected');
    intersect = false;
  }
  event.preventDefault();
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
    event.preventDefault();
  }
});
// ---- folder code ----

// ---- info screen code ----
closeBtn.addEventListener('click', (event) => {
  info.style.transform = 'translate(-50%, -50%) scale(0)';
  event.preventDefault();
});
// ---- info screen code ----

// ---- weather code ----
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherData(lat, lon);
  });
}

function getWeatherData(lat, lon) {
  const apiKey = '7b29be37390b450d9e743140230704';
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat}, ${lon}&aqi=no`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayWeatherData(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function displayWeatherData(data) {
  const weatherWidget = document.getElementById('weather-widget');
  const tempC = data.current.temp_c;
  const tempF = data.current.temp_f;
  const weather = data.current.condition.text;

  weatherWidget.innerHTML = `Temperature: ${tempC} &deg;C, ${tempF} &deg;F<br>Weather: ${weather}`;
}
// ---- weather code ----

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