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
    newLogElement.id = id;

    document.getElementById("logs").appendChild(newLogElement);
    
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

        setTimeout(() => {
            document.getElementById("app-title").style.marginTop = "50px";
            document.getElementById("current-process-display").style.opacity = "1";

            window.installer.beginInstallation("args");
        }, 200);  
    }
}

// Main
window.installer.newLogEntry((event, args) => {

    if (logEntries.length > 0) {
        document.getElementById(logEntries[logEntries.length - 1]).innerHTML += " Done ✔️";
    }

    spawnLogEntry(currId, args);

    currId ++;
})

window.installer.completeLastLogEntry((event, args) => {

    if (logEntries.length > 0) {
        document.getElementById(logEntries[logEntries.length - 1]).innerHTML += " Done ✔️";
    }
})