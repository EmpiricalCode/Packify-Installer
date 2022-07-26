// Constants
const url = require("url");
const https = require("https");
const fs = require("fs");
const request = require("request");
const path = require("path");

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
                // this.window.webContents.toggleDevTools();
            });

            this.window.on("close", (event) => {
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

    static completeLastLogEntry() {
        this.window.webContents.send("complete-last-log-entry");
    }

    static downloadComplete() {
        this.window.webContents.send("download-complete");
    }

    static async fetchUrl(url, callback) {
        return new Promise(resolve => {

            request(url, (err, res, body) => {

                callback(err, res, body, resolve);
            })
        });
    }

    static async downloadUrl(url, callback) {
        return new Promise (resolve => {

            req = https.get(url, (res) => {

                callback(res, resolve);
            })
        })
    }

    static async beginInstallation() {

        try {

            var latestInfoHeader = undefined;
            var latestInfo = undefined;

            // Fetching latest version
            this.spawnLogEntry("Fetching latest version . . .");

            await this.fetchUrl(config.latestUrl, (err, res, body, resolve) => {

                latestInfoHeader = JSON.parse(body);

                this.completeLastLogEntry();
                
                resolve();
            });

            // Checking if latest version exists
            this.spawnLogEntry("Checking latest version info . . .");

            if (latestInfoHeader && latestInfoHeader.versionName) {

                await this.fetchUrl(`https://raw.githubusercontent.com/primalc0de/Packify-Releases/${latestInfoHeader.versionName}/info.json`, (err, res, body, resolve) => {

                    latestInfo = JSON.parse(body);

                    this.completeLastLogEntry();
                    
                    resolve();
                });

                this.spawnLogEntry("Downloading latest version . . .");
                
                await this.downloadUrl(`https://raw.githubusercontent.com/primalc0de/Packify-Releases/${latestInfoHeader.versionName}/packed.zip`, (res, resolve) => {

                    const file = fs.createWriteStream(path.join(__dirname, "../../packed.zip"));
                    var recievedBytes = 0;

                    res.pipe(file);

                    res.on("data", (chunk) => {
                        recievedBytes += chunk.length;
 
                        this.window.webContents.send("download-progress", {current : recievedBytes, total : latestInfo.size});
                    })

                    res.on("end", () => {

                        this.completeLastLogEntry();
                        this.downloadComplete();

                        resolve();
                    })
                });
            }   

        } catch {
            // TODO: Handle installation errors
        }
    }
}

module.exports = MainWindowHandler;