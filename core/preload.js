// Constants
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("installer", {
    
    beginInstallation: () => {ipcRenderer.invoke("begin-installation")},

    newLogEntry: (callback) => {
        ipcRenderer.on("new-log-entry", (event, args) => {
            callback(event, args);
        })
    },

    completeLastLogEntry: (callback) => {
        ipcRenderer.on("complete-last-log-entry", (event, args) => {
            callback(event, args);
        })
    },

    downloadProgress: (callback) => {
        ipcRenderer.on("download-progress", (event, args) => {
            callback(event, args);
        })
    },

    downloadComplete: (callback) => {
        ipcRenderer.on("download-complete", (event, args) => {
            callback(event, args);
        })
    }
})