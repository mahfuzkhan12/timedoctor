const { ipcRenderer, remote } = require('electron')


const play = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440z"></path></svg>`
const pause = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M199.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8zM375.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8z"></path></svg>`


let paused = false;


let $playPause;
let $mute;
let $tiktok;
let $status;

const updatePlayPause = () => {
    $playPause.innerHTML = paused ? play : pause
    if(paused){
        $status.add("paused")
    }else {
        $status.remove("paused")
    }
}


document.addEventListener('DOMContentLoaded', () => {
    $tiktok = document.querySelector("#tik-tok")
    $status = document.querySelector(".status").classList

    $playPause = document.querySelector("#pauseButton")
    $playPause.addEventListener("click", () => {
        paused = !paused
        updatePlayPause()
        ipcRenderer.send('pause', {small: true, isPaused: paused})
    })

    document.querySelector("#closeButton").addEventListener("click", () => {
        ipcRenderer.send('close-small', { type: "close" })
    })

    document.querySelectorAll(".click").forEach((item) => {
        item.addEventListener("click", function() {
            ipcRenderer.send('activate')
        });
    });

    updatePlayPause()
})

ipcRenderer.on('paused', (event, isPaused) => {
    paused = isPaused
    updatePlayPause()
})