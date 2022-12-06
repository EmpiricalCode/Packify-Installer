// Constants
const os = require("os");

let app_installation_path;

if (os.platform == "darwin") {
    app_installation_path = `/Users/${os.userInfo().username}/Packify`;
} else {
    app_installation_path = `/Users/${os.userInfo().username}/Packify`;
}

// Main
module.exports = {
    "latestUrl" : "https://raw.githubusercontent.com/EmpiricalCode/Packify-Releases/master/latest.json"
}