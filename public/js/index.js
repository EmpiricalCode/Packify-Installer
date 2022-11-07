// Variables
var logEntries = [];
var currId = 0;
var installing = false;

var logEntryElements = document.getElementsByClassName("log-entry");
var subtitleRegion = document.getElementById("subtitle-region");
var installButton = document.getElementById("install-button");
var appTitle = document.getElementById("app-title");
var currentProcessDisplay = document.getElementById("current-process-display");
var downloadProgressBackground = document.getElementById("download-progress-background");
var downloadProgressBar = document.getElementById("download-progress-bar");


// Functions
function spawnLogEntry(id, message) {

    if (logEntries.length == 3) {
        
        const lastLogElement = document.getElementById(logEntries[0]);

        lastLogElement.style.opacity = 0;
        lastLogElement.style.marginTop = "-30px";

        setTimeout(() => {
            lastLogElement.remove();
        }, 400);
        
        logEntries = logEntries.slice(1);
    }

    const newLogElement = document.createElement("p");

    newLogElement.classList.add("log-entry");
    newLogElement.innerHTML = message;

    const logElementContainer = document.createElement("div");

    logElementContainer.id = id;
    logElementContainer.classList.add("log-entry-container");

    document.getElementById("logs").appendChild(logElementContainer);
    document.getElementById(id).appendChild(newLogElement);
    
    logEntries.push(id);

    setTimeout(() => {
        document.getElementById(id).style.opacity = 1;
    }, 100);
}

function install() {

    if (!installing) {

        installing = true;

        subtitleRegion.style.opacity = "0";
        subtitleRegion.style.zindex = "0";
        installButton.style.cursor = "default";

        setTimeout(() => {
            appTitle.style.marginTop = "50px";
            currentProcessDisplay.style.opacity = "1";

            window.installer.beginInstallation("args");
        }, 200);  
    }
}

function flicker(element, num) {
    if (num > 0) {
        setTimeout(() => {
            element.style.opacity = num % 2;
            flicker(element, num - 1);
        }, 40);
    }
}

// Main
window.installer.newLogEntry((event, args) => {

    spawnLogEntry(currId, args);

    currId ++;
})

window.installer.completeLastLogEntry((event, args) => {

    if (logEntries.length > 0) {

        var lastIndicator = document.getElementById("latest-indicator");
        
        if (lastIndicator) {
            lastIndicator.id = undefined;
        }

        document.getElementById(logEntries[logEntries.length - 1]).innerHTML += `<p id="latest-indicator" class="log-entry-complete-indicator">COMPLETE</p>`;
        flicker(document.getElementById("latest-indicator"), 4);
    }
})

window.installer.downloadProgress((event, args) => {
    
    downloadProgressBackground.style.opacity = "1";
    downloadProgressBar.style.width = `${parseInt(args.current) / parseInt(args.total) * 100}%`;
})

window.installer.downloadComplete((event, args) => {

    downloadProgressBackground.style.opacity = "0";
})