const { ipcRenderer, remote, desktopCapturer } = require('electron')

// 
var paused = true
var playPausebutton;
var mainWrapper;

const play = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440z"></path></svg>`
const pause = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M199.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8zM375.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8z"></path></svg>`
const noWiFi = `<svg stroke="currentColor" class="no" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="m21 11 2-2c-3.73-3.73-8.87-5.15-13.7-4.31l2.58 2.58c3.3-.02 6.61 1.22 9.12 3.73zm-2 2a9.895 9.895 0 0 0-3.72-2.33l3.02 3.02.7-.69zM9 17l3 3 3-3a4.237 4.237 0 0 0-6 0zM3.41 1.64 2 3.05 5.05 6.1C3.59 6.83 2.22 7.79 1 9l2 2c1.23-1.23 2.65-2.16 4.17-2.78l2.24 2.24A9.823 9.823 0 0 0 5 13l2 2a6.999 6.999 0 0 1 4.89-2.06l7.08 7.08 1.41-1.41L3.41 1.64z"></path></svg>`
const WiFi = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z"></path><path d="m1 9 2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8 3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4 2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"></path></svg>`

const updatePlayPause = () => {
    if(playPausebutton){
        playPausebutton.innerHTML = paused ? play : pause
        const classList = mainWrapper.classList
        if(paused){
            classList.add("paused")
        }else {
            classList.remove("paused")
        }
    }
}

window.addEventListener("load", (event) => {
    

    mainWrapper = document.querySelector(".wrapper")
    playPausebutton = document.querySelector("#play-pause")
    playPausebutton.addEventListener("click", function() {
        paused = !paused
        updatePlayPause()
        ipcRenderer.send('pause', {main: true, isPaused: paused})
    })

    updatePlayPause()


    document.querySelector('.projects-opener').addEventListener('click', function() {
        var content = document.querySelector('.project-list');
        var contentWrapper = document.querySelector('.project-scrollable');
        var isShown = contentWrapper.classList.contains('show');
        
        if (!isShown) {
            content.style.maxHeight = '200px';
            setTimeout(function() {
                content.style.maxHeight = 'auto';
            }, 300);
        } else {
            content.style.maxHeight = '0';
        }
        contentWrapper.classList.toggle('show');
    });


    document.querySelectorAll(".project-list .item").forEach((item) => {
        item.addEventListener("click", function() {
            this.parentNode.querySelectorAll('.item').forEach((sibling) => {
                sibling.classList.remove('active');
            });
            this.classList.add('active');
        });
    });




    document.getElementById('ss').addEventListener('click', () => { // The button which takes the screenshot
        ipcRenderer.send("ss")
        // desktopCapturer.getSources({ types: ['screen'] })
        //     .then( sources => {
        //         document.getElementById('img').src = sources[0].thumbnail.toDataURL() // The image to display the screenshot
        //     })
    })


    const updateOnlineStatus = () => {
        document.getElementById('status').innerHTML = navigator.onLine ? "" : noWiFi
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    updateOnlineStatus()


});


ipcRenderer.on('ss', (event, data) => {
    console.log(data);
    document.getElementById('img').src = data
})
ipcRenderer.on('paused', (event, isPaused) => {
    paused = isPaused
    updatePlayPause()
})