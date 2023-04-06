const clock = document.getElementById('clock');
const folder = document.getElementById('portfolio-folder');
let clicks = 0;

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
