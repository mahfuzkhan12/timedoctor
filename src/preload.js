// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


// 
var paused = true
var playPausebutton;
var mainWrapper;

const play = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440z"></path></svg>`
const pause = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"></path></svg>`

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

});