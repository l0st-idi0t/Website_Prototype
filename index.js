const clock = document.getElementById('clock');
const info = document.querySelector('.info');
const closeBtn = document.getElementById('close');

//selection box
const selectionBox = document.createElement('div');
selectionBox.classList.add('selection-box');
document.body.appendChild(selectionBox);
let startSelection = false;
let startX, startY;

//hehe you don't get to select any text
document.body.style.userSelect = 'none';

// ---- folder class ----
class Folder {
  constructor(folderElement) {
    this.folderElement = folderElement;
    this.dragOffset = { x: 0, y: 0 };
    this.folderOffset = { x: 0, y: 0 };
    this.folderSize = { width: this.folderElement.offsetWidth, height: this.folderElement.offsetHeight };
    this.openable = folderElement.getAttribute('openable') === 'true';
    this.infoElement = null;
    this.intersected = false;
    this.isDragging = false;
    this.ghostFolder = null;

    // get linked info element
    if (this.openable) {
      this.infoElement = document.getElementById(folderElement.getAttribute('link'));
      const closeBtn = this.infoElement.querySelector('input[type="button"]');

      closeBtn.addEventListener('click', (event) => {
        this.infoElement.style.transform = 'translate(-50%, -50%) scale(0)';
        event.preventDefault();
      });
    }

    this.folderElement.addEventListener('click', (event) => {
      this.folderElement.classList.add('selected');
      event.preventDefault();
    });

    this.folderElement.addEventListener('dragstart', (event) => {
      if (!this.openable) {
        return;
      }

      this.isDragging = true;
      this.dragOffset.x = event.clientX;
      this.dragOffset.y = event.clientY;
      this.folderOffset.x = this.folderElement.offsetLeft;
      this.folderOffset.y = this.folderElement.offsetTop;
    
      // Create a ghost folder with the same size as the original folder
      this.ghostFolder = document.createElement('div');
      this.ghostFolder.classList.add('folder', 'ghost');
      this.ghostFolder.style.width = this.folderSize.width + 'px';
      this.ghostFolder.style.height = this.folderSize.height + 'px';
      this.ghostFolder.style.top = this.folderOffset.y + 'px';
      this.ghostFolder.style.left = this.folderOffset.x + 'px';
      document.body.appendChild(this.ghostFolder);
    });

    this.folderElement.addEventListener('click', (event) => {
      this.folderElement.classList.add('selected');
      event.preventDefault();
    });
    
    this.folderElement.addEventListener('dblclick', (event) => {
      this.folderElement.classList.remove('selected');
      if (this.openable && this.infoElement) {
        this.infoElement.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      event.preventDefault();
    });

    document.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        startSelection = false;
        // Move the ghost folder with the mouse
        this.ghostFolder.style.top = this.folderOffset.y + event.clientY - this.dragOffset.y + 'px';
        this.ghostFolder.style.left = this.folderOffset.x + event.clientX - this.dragOffset.x + 'px';
      }
    });
    
    document.addEventListener('mouseup', (event) => {
      if (this.isDragging) {
        // Remove the ghost folder
        this.ghostFolder.parentNode.removeChild(this.ghostFolder);
        
        // Move the original folder to the final position
        this.folderElement.style.top = this.folderOffset.y + event.clientY - this.dragOffset.y + 'px';
        this.folderElement.style.left = this.folderOffset.x + event.clientX - this.dragOffset.x + 'px';
        
        this.isDragging = false;
        event.preventDefault();
      }
    });
    
  }
  
} 

//create an array of folder objects
const folders = Array.from(document.querySelectorAll('.folder')).map(folderElement => new Folder(folderElement));
// ---- folder class ----

// ---- selection box code ----
document.addEventListener('mousedown', (event) => {
  startSelection = true;
  startX = event.clientX;
  startY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
  for (const folder of folders) {
    if (folder.isDragging) {
      startSelection = false;
      folder.intersected = false;
      return;
    }
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

    for (const folder of folders) {
      const folderRect = folder.folderElement.getBoundingClientRect();
      const selectionBoxRect = selectionBox.getBoundingClientRect();
      intersect = !(folderRect.right < selectionBoxRect.left || 
                        folderRect.left > selectionBoxRect.right || 
                        folderRect.bottom < selectionBoxRect.top || 
                        folderRect.top > selectionBoxRect.bottom);

      if (intersect) {
        folder.folderElement.classList.add('selected');
        folder.intersected = true;
      }
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

// ---- folder click code ----
document.addEventListener('click', (event) => {
  for (const folder of folders) {
    if (!folder.folderElement.contains(event.target)) {
      folder.folderElement.classList.remove('selected');
    }

    if (folder.intersected) {
      folder.folderElement.classList.add('selected');
      folder.intersected = false;
    }
  }
  event.preventDefault();
});
// ---- folder click code ----

// ---- weather code ----
const weatherWidget = document.getElementById('weather-widget');

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherData(lat, lon);
      weatherWidget.style.display = 'flex';
    }, () => {
      alert("Cannot get your location for weather.");
    });
  } else {
    alert("GeoLocation is not supported by your browser.");
  }
}

getLocation();

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
  const tempC = data.current.temp_c;
  const tempF = data.current.temp_f;
  const icon = data.current.condition.icon;

  const iconElem = document.getElementById('weather-icon');
  const tempElem = document.getElementById('weather-temp');

  iconElem.src = 'https:' + icon;
  tempElem.innerHTML = `${tempC}°C / ${tempF}°F`;

  setTimeout(() => {
    iconElem.style.animation = 'fadein 1s ease-in-out forwards';
    tempElem.style.animation = 'fadein 1s ease-in-out forwards';
  }, 300);
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