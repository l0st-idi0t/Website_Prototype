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

// ---- folder class ----
class Folder {
  constructor(folderElement) {
    this.folderElement = folderElement;
    this.dragOffset = { x: 0, y: 0 };
    this.folderOffset = { x: 0, y: 0 };
    this.folderSize = { width: this.folderElement.offsetWidth, height: this.folderElement.offsetHeight };
    this.openable = false;
    this.outside = false;
    this.intersected = false;
    this.isDragging = false;
    this.ghostFolder = null;

    this.folderElement.addEventListener('click', (event) => {
      this.folderElement.classList.add('selected');
      event.preventDefault();
    });

    this.folderElement.addEventListener('dragstart', (event) => {
      this.isDragging = true;
      this.dragOffset.x = event.clientX;
      this.dragOffset.y = event.clientY;
      this.folderOffset.x = this.folderElement.offsetLeft;
      this.folderOffset.y = this.folderElement.offsetTop;
      this.infoElement = null;
    
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
      folder.classList.remove('selected');
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

  // create info element
  createInfoElement(name) {
    this.infoElement = document.createElement('div');
    this.infoElement.classList.add('info');
    this.infoElement.innerHTML = `
      <div class="info-header">
        <h2>${name}</h2>
        <button id="close">Close</button>
      </div>
      <div class="info-content">
        <p>Some text</p>
      </div>
    `;
    document.body.appendChild(this.infoElement);

    let closeBtn = this.infoElement.getElementById('close');

    closeBtn.addEventListener('click', (event) => {
      this.infoElement.style.transform = 'translate(-50%, -50%) scale(0)';
      event.preventDefault();
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
    // const folderRect = folder.getBoundingClientRect();
    // const selectionBoxRect = selectionBox.getBoundingClientRect();
    // intersect = !(folderRect.right < selectionBoxRect.left || 
    //                     folderRect.left > selectionBoxRect.right || 
    //                     folderRect.bottom < selectionBoxRect.top || 
    //                     folderRect.top > selectionBoxRect.bottom);

    for (const folder of folders) {
      const folderRect = folder.getBoundingClientRect();
      const selectionBoxRect = selectionBox.getBoundingClientRect();
      intersect = !(folderRect.right < selectionBoxRect.left || 
                        folderRect.left > selectionBoxRect.right || 
                        folderRect.bottom < selectionBoxRect.top || 
                        folderRect.top > selectionBoxRect.bottom);

      if (intersect) {
        folder.classList.add('selected');
        folder.intersected = true;
      }
    }

    // if (intersect) {
    //   folder.classList.add('selected');
    // }
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
// folder.addEventListener('click', (event) => {
//   folder.classList.add('selected');
//   event.preventDefault();
// });

// folder.addEventListener('dblclick', (event) => {
//   folder.classList.remove('selected');
//   info.style.transform = 'translate(-50%, -50%) scale(1)';
//   event.preventDefault();
// });

document.addEventListener('click', (event) => {
  for (const folder of folders) {
    if (!folder.contains(event.target)) {
      folder.classList.remove('selected');
    }

    if (folder.intersected) {
      folder.classList.add('selected');
      folder.intersected = false;
    }
  }

  // if (!folder.contains(event.target)) {
  //   folder.classList.remove('selected');
  // }
  
  // if (intersect) {
  //   folder.classList.add('selected');
  //   intersect = false;
  // }
  event.preventDefault();
});

// folder.addEventListener('dragstart', (event) => {
//   isDragging = true;
//   dragOffset.x = event.clientX;
//   dragOffset.y = event.clientY;
//   folderOffset.x = folder.offsetLeft;
//   folderOffset.y = folder.offsetTop;

//   // Create a ghost folder with the same size as the original folder
//   ghostFolder = document.createElement('div');
//   ghostFolder.classList.add('folder', 'ghost');
//   ghostFolder.style.width = folderSize.width + 'px';
//   ghostFolder.style.height = folderSize.height + 'px';
//   ghostFolder.style.top = folderOffset.y + 'px';
//   ghostFolder.style.left = folderOffset.x + 'px';
//   document.body.appendChild(ghostFolder);
// });

// document.addEventListener('mousemove', (event) => {
//   if (isDragging) {
//     startSelection = false;
//     // Move the ghost folder with the mouse
//     ghostFolder.style.top = folderOffset.y + event.clientY - dragOffset.y + 'px';
//     ghostFolder.style.left = folderOffset.x + event.clientX - dragOffset.x + 'px';
//   }
// });

// document.addEventListener('mouseup', (event) => {
//   if (isDragging) {
//     // Remove the ghost folder
//     ghostFolder.parentNode.removeChild(ghostFolder);
    
//     // Move the original folder to the final position
//     folder.style.top = folderOffset.y + event.clientY - dragOffset.y + 'px';
//     folder.style.left = folderOffset.x + event.clientX - dragOffset.x + 'px';
    
//     isDragging = false;
//     event.preventDefault();
//   }
// });
// ---- folder code ----

// ---- info screen code ----
closeBtn.addEventListener('click', (event) => {
  info.style.transform = 'translate(-50%, -50%) scale(0)';
  event.preventDefault();
});
// ---- info screen code ----

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