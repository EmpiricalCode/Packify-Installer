// Constants
const url = require("url");
const path = require("path");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

// Class
class WindowHandler {

    static window;

    static spawn() {
        console.log("No spawn method was initilized");
    }

    static getWindow() {
        return this.window;
    }

    static spawnWindow(resource_url, preferences) {

        const window = new BrowserWindow(preferences);

        window.loadURL(url.format({
            pathname: resource_url,
            protocol: 'file:',
            slashes: true
        }))

        return window;
    }
}
module.exports = WindowHandler;