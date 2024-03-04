const { app, BrowserWindow, Tray, Menu, screen, ipcMain, contentTracing, desktopCapturer, globalShortcut } = require('electron');
const mergeImg = require("merge-img")
const path = require('path');

if (require('electron-squirrel-startup')) {
    app.quit();
}


var OBJ = {
    acivityBar: {
        visible: true
    },
    paused: false,
}


const menus = () => [
    {label: "Show window", click: () => createWindowMain()},
    {label: "Go to Dashboard"},
    {type: "separator"},
    {label: OBJ?.paused ? "Unpause" : "Pause", click: () => pauseResume(!OBJ?.paused)},
    {type: "separator"},
    {
        label: "Activity Bar", 
        type: "submenu", 
        submenu: [
            {label: "Visible", checked: OBJ?.acivityBar?.visible, type: "radio"},
            {label: "Hidden untill 5am", checked: false, type: "radio"},
            {label: "Hidden", checked: !OBJ?.acivityBar?.visible, type: "radio"},
        ]
    },
    {type: "separator",},
    {type: "separator"},
    {label: "Launch at sign in", checked: true, type: "checkbox"},
    {label: "Notify when tracking start", checked: false, type: "checkbox"},
    {type: "separator"},
    {label: "Sign out"},
    {role: "quit"},
]
const trayIcon = {
    paused: "assets/tray-paused.png",
    unpaused: "assets/tray.png",
}

// main window menus
const mainMenus = Menu.buildFromTemplate([
    {
        label: "Application",
        submenu: menus()
    }
])
Menu.setApplicationMenu(mainMenus)


var mainWindow;
var smallWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        // width: 800,
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '/preloaders/main.js'),
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'), {hash: "asb"});
    mainWindow.webContents.openDevTools();
};

const createBarWindow = () => {
    const screenWidth = screen.getPrimaryDisplay().size.width;
    const screenHeight = screen.getPrimaryDisplay().size.height;
    const windowWidth = 450;
    const windowHeight = 30;
    const windowX = Math.floor((screenWidth - windowWidth) / 2);
    const windowY = screenHeight - 80;

    smallWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        transparent: true,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        x: windowX,
        y: windowY,
        webPreferences: {
            // preload: path.join(__dirname, 'smallWindow.js'),
            preload: path.join(__dirname, '/preloaders/smallWindow.js'),
        },
        frame: false,
        closable: true,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
    });

    smallWindow.loadFile(path.join(__dirname, 'renderer/activityBar.html'));
}


const createWindowMain = () => {
    console.log(mainWindow);
    if (BrowserWindow.getAllWindows().length === 0 || !mainWindow || mainWindow?.isDestroyed()) {
        createWindow();
    }
    if(mainWindow){
        mainWindow?.focus()
    }
}
const createActiviyBarWindow = () => {
    createBarWindow();
}

var tray = null;
const createTray = () => {
    tray = new Tray(path.join(__dirname, OBJ?.paused ? trayIcon?.paused : trayIcon.unpaused))
    tray.setToolTip("TimeDoctor")
    tray.setContextMenu(Menu.buildFromTemplate(menus()))
}

const takeSS = () => {
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: {width: 2000, height: 1125} })
        .then( sources => {
            let ss = []
            sources.map(item => {
                ss.push(item?.thumbnail?.toPNG())
            })
            mergeImg(ss)
                .then((img) => {
                    img.write('out.png', () => console.log('done'));
                    // mainWindow.webContents.send("ss", img)// The image to display the screenshot
                });
        })
}

const updateOBJ = (val, index) => {
    OBJ[index] = val
    tray.setContextMenu(Menu.buildFromTemplate(menus()))
    Menu.setApplicationMenu(mainMenus)
}
const pauseResume = (isPaused, fromIPC = false) => {
    updateOBJ(isPaused, "paused")
    tray.setImage(path.join(__dirname, isPaused ? trayIcon?.paused : trayIcon.unpaused));

    if(!fromIPC){
        if(smallWindow && !smallWindow?.isDestroyed()){
            smallWindow.webContents.send('paused', isPaused)
        }
        if (mainWindow && !mainWindow?.isDestroyed()) {
            mainWindow.webContents.send('paused', isPaused)
        }
    }
}


let idleTime = 0;
app.on('ready', function() {
    createWindow()
    createActiviyBarWindow()
    createTray()
    pauseResume()

});


app.on('window-all-closed', (event) => {
    event.preventDefault()
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});

app.on('activate', () => {
    createWindowMain()
});





// ipc 
ipcMain.on('activate', (event) => {
    createWindowMain()
})
ipcMain.on('ss', (event) => {
   takeSS()
})
ipcMain.on('close-small', (event, sourceId) => {
    if (smallWindow && !smallWindow?.isDestroyed()) {
        smallWindow?.close();
    }
})
ipcMain.on('pause', (event, data) => {
    if (data?.main && smallWindow && !smallWindow?.isDestroyed()) {
        smallWindow.webContents.send('paused', data?.isPaused)
    }
    if (data?.small && mainWindow && !mainWindow?.isDestroyed()) {
        mainWindow.webContents.send('paused', data?.isPaused)
    }
    pauseResume(data?.isPaused, true)
})