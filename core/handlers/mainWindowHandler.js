// Constants
const url = require("url");
const https = require("https");
const fs = require("fs");
const request = require("request");
const path = require("path");
const unzipper = require("unzipper");

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

    static async beginInstallation() {

        const username = require("os").userInfo().username;

        var latestInfoHeader = undefined;
        var latestInfo = undefined;

        // Checking for an installed version
        this.spawnLogEntry("Checking installation directory . . .");

        await new Promise(resolve => {

            try {
                if (fs.existsSync(`C:/Users/${username}/Packify`)) {

                    dialog.showErrorBox("Error", "The installation directory is occupied.");
                    app.quit();
                } else {

                    this.completeLastLogEntry();
                    
                    setTimeout(() => {
                        resolve();
                    }, 200);
                }

            } catch {
                console.log("Failed to check installation directory");
            }
        });

        // Fetching latest version
        this.spawnLogEntry("Fetching latest version . . .");

        await this.fetchUrl(config.latestUrl, (err, res, body, resolve) => {

            try {
                latestInfoHeader = JSON.parse(body);

                this.completeLastLogEntry();
                
                setTimeout(() => {
                    resolve();
                }, 200);

            } catch {
                console.log("Failed to requestion latest version");
            }
        });

        // Checking if latest version exists
        this.spawnLogEntry("Checking latest version info . . .");

        if (latestInfoHeader && latestInfoHeader.versionName) {

            await this.fetchUrl(`https://raw.githubusercontent.com/EmpiricalCode/Packify-Releases/${latestInfoHeader.versionName}/info.json`, (err, res, body, resolve) => {

                try {
                    latestInfo = JSON.parse(body);

                    this.completeLastLogEntry();
                    
                    setTimeout(() => {
                        resolve();
                    }, 500); // Timeout of 500ms as a style choice for the installation
                    
                } catch {
                    console.log("Failed to get latest version info");
                }
            });

            this.spawnLogEntry("Downloading latest version . . .");
            
            await new Promise (resolve => {

                try {
                    
                    https.get(`https://raw.githubusercontent.com/EmpiricalCode/Packify-Releases/${latestInfoHeader.versionName}/packed.zip`, (res) => {

                        const file = fs.createWriteStream(path.join(__dirname, "../../../packed.zip"));
                        var recievedBytes = 0;

                        res.pipe(file);

                        res.on("data", (chunk) => {

                            try {
                                recievedBytes += chunk.length;
                                this.window.webContents.send("download-progress", {current : recievedBytes, total : latestInfo.size});

                            } catch {
                                console.log("Failed to download latest version");
                            }
                        })

                        res.on("end", () => {

                            try {
                                this.completeLastLogEntry();
                                this.downloadComplete();

                                setTimeout(() => {
                                    resolve();
                                }, 200);

                            } catch {
                                console.log("Failed to download latest version");
                            }

                        })

                    });

                } catch {
                    console.log("Failed to download latest version");
                }
            });

            this.spawnLogEntry("Unzipping . . .");

            // This is to prevent a weird Invalid Package error
            process.noAsar = true;

            await new Promise (resolve => {

                try {

                    fs.createReadStream(path.join(__dirname, "../../../packed.zip")).pipe(unzipper.Extract({ path: `C:/Users/${username}/Packify` })).on("close", () => {

                        this.completeLastLogEntry();

                        // Re-enable Asar
                        process.noAsar = false;

                        setTimeout(() => {
                            resolve();
                        }, 200);
                    });

                } catch {

                    console.log("Failed to unzip installation");
                    this.completeLastLogEntry();
                    process.noAsar = true;
                }
            });
        }   
    }
}

module.exports = MainWindowHandler;