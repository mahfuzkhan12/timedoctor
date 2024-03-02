const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const menus = [
    {label: "Show window", click: () => createWindowMain()},
    {label: "Go to Dashboard"},
    {type: "separator"},
    {label: "Unpause"},
    {type: "separator"},
    {
        label: "Activity Bar", 
        type: "submenu", 
        submenu: [
            {label: "Visible", checked: true, type: "radio"},
            {label: "Hidden untill 5am"},
            {label: "Hidden"},
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


// main window menus
const mainMenus = Menu.buildFromTemplate([
    {
        label: "Application",
        submenu: menus
    }
])
Menu.setApplicationMenu(mainMenus)

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        // width: 800,
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
    mainWindow.webContents.openDevTools();
};


const createWindowMain = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
}

var tray = null;
const createTray = () => {
    tray = new Tray(path.join(__dirname, "assets/tray-paused.png"))
    tray.setToolTip("TimeDoctor")

    const menus = Menu.buildFromTemplate([
        {role: "reload"},
        {label: "Show window", click: () => createWindowMain()},
        {label: "Go to Dashboard"},
        {type: "separator"},
        {label: "Unpause"},
        {type: "separator"},
        {
            label: "Activity Bar", 
            type: "submenu", 
            submenu: [
                {label: "Visible", checked: true, type: "radio"},
                {label: "Hidden untill 5am"},
                {label: "Hidden"},
            ]
        },
        {type: "separator",},
        {type: "separator"},
        {label: "Launch at sign in", checked: true, type: "checkbox"},
        {label: "Notify when tracking start", checked: false, type: "checkbox"},
        {type: "separator"},
        {label: "Sign out"},
        {role: "quit"},
    ])
    tray.setContextMenu(menus)


    // setTimeout(() => {
    //     changeTrayIcon()
    // }, 2000);
}


const changeTrayIcon = () => {
    if (tray !== null) {
        tray.setImage(path.join(__dirname, "assets/tray-paused.png"));
    }

}


app.on('ready', function() {
    createWindow()
    createTray()
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
