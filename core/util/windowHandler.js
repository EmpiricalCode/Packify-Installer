// Constants
const url = require("url");
const path = require("path");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

// Functions
function spawnWindow(resource_url, preferences) {

    const window = new BrowserWindow(preferences);

    window.loadURL(url.format({
        pathname: resource_url,
        protocol: 'file:',
        slashes: true
    }))

    return window;
}

module.exports.spawnWindow = spawnWindow;