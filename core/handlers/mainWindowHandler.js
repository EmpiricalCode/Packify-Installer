// Constants
const path = require("path");
const url = require("url");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const windowHandler = require(path.join(__dirname, "../util/windowHandler.js"));

// Let statments
let window;

// Functions
function spawnLogEntry(content) {
    window.webContents.send("new-log-entry", content);
}

function spawn() {

    if (!window) {

        window = windowHandler.spawnWindow(path.join(__dirname, "../../public/html/index.html"), {
            width: 600, 
            height: 400,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, "../preload.js")
            },
            titleBarStyle: 'hidden',
            resizable: false
        });

        // Initialization
        window.once("ready-to-show", () => {
            window.webContents.toggleDevTools();
        });

        window.on("closed", () => {
            window = undefined;
        })

        // Main Window communication
        ipcMain.handle("begin-installation", (event, args) => {
            spawnLogEntry("Fetching latest version . . .");
        })

    } else {
        window.focus();
    }
}

function getWindow() {
    return window;
}

module.exports.getWindow = getWindow;
module.exports.spawn = spawn;