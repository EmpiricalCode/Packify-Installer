// Constants
const path = require("path");
const url = require("url");
const https = require("https");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));
const config = require(path.join(__dirname, "../config.js"));

// Class
class MainWindowHandler extends WindowHandler {

    static spawn() {

        if (!this.window) {

            this.window = this.spawnWindow(path.join(__dirname, "../../public/html/index.html"), {
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
            this.window.once("ready-to-show", () => {
                this.window.webContents.toggleDevTools();
            });

            this.window.on("closed", () => {
                this.window = undefined;
            })

            // Main Window communication
            ipcMain.handle("begin-installation", (event, args) => {
                this.beginInstallation();
            })

        } else {
            this.window.focus();
        }
    }

    static spawnLogEntry(content) {
        this.window.webContents.send("new-log-entry", content);
    }
    
    static async beginInstallation() {

        this.spawnLogEntry("Fetching latest version . . .");

        const request = https.get(config.latestUrl, (response) => {

            response.on("data", (data) => {
                console.log(data);
            })
        })
    }
}

module.exports = MainWindowHandler;