const { ipcRenderer, remote, desktopCapturer } = require('electron')

// 
var paused = true
var playPausebutton;
var mainWrapper;

const play = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440z"></path></svg>`
const pause = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M199.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8zM375.9 416h-63.8c-4.5 0-8.1-3.6-8.1-8V104c0-4.4 3.6-8 8.1-8h63.8c4.5 0 8.1 3.6 8.1 8v304c0 4.4-3.6 8-8.1 8z"></path></svg>`

const updatePlayPause = () => {
    playPausebutton.innerHTML = paused ? play : pause
    const classList = mainWrapper.classList
    if(paused){
        classList.add("paused")
    }else {
        classList.remove("paused")
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


});


ipcRenderer.on('ss', (event, data) => {
    console.log(data);
    document.getElementById('img').src = data
})
ipcRenderer.on('paused', (event, isPaused) => {
    paused = isPaused
    updatePlayPause()
})