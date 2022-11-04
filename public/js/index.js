// Variables
var logEntries = [];
var currId = 0;
var installing = false;

// Functions
function spawnLogEntry(id, message) {

    const logEntryElements = document.getElementsByClassName("log-entry");

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

        document.getElementById("subtitle-region").style.opacity = "0";
        document.getElementById("subtitle-region").style.zindex = "0";
        document.getElementById("install-button").style.cursor = "default";

        setTimeout(() => {
            document.getElementById("app-title").style.marginTop = "50px";
            document.getElementById("current-process-display").style.opacity = "1";

            window.installer.beginInstallation("args");
        }, 200);  
    }
}

function flicker(element, num) {
    if (num > 0) {
        setTimeout(() => {
            element.style.opacity = num % 2;
            flicker(element, num - 1);
        }, 50);
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
    
    document.getElementById("download-progress-background").style.opacity = "1";
    document.getElementById("download-progress-bar").style.width = `${parseInt(args.current) / parseInt(args.total) * 100}%`;
})

window.installer.downloadComplete((event, args) => {

    document.getElementById("download-progress-background").style.opacity = "0";
})