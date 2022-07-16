// Constants
const path = require("path");
const url = require("url");

const {app, browserWindow} = require("electron");

const mainWindowHandler = require(path.join(__dirname, "core/handlers/mainWindowHandler.js"));

// App main
app.on("ready", () => {
    mainWindowHandler.spawn();
})