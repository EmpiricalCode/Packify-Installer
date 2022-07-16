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
    }
})