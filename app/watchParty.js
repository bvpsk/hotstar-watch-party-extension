let socketUrl3 = "https://cherie-party.herokuapp.com"
// let socketUrl3 = "http://localhost:5555"

let hwpExtensionId;
let extensionInstalled = false;

let actionsHolder = document.querySelector(".action-holder");
actionsHolder.style["display"] = "flex";
actionsHolder.style["alignItems"] = "center";
let wpDiv = document.createElement("div");
wpDiv.id = "wp-holder";

let logoImg = document.createElement("img")
logoImg.classList.add("wp-logo");
logoImg.src = chrome.runtime.getURL("app/icon.png");

wpDiv.append(logoImg, "WATCH PARTY")
actionsHolder.append(wpDiv);

wpDiv.addEventListener("click", () => {
    console.log("Watch Party")
    // disableScrolling();

    // Check whether extension installed or not
    let extIdDiv = document.querySelector("#extension-present");
    extensionInstalled = extIdDiv != undefined;
    hwpExtensionId = extIdDiv.innerHTML;
    console.log({hwpExtensionId, extensionInstalled});

    let vidEl = document.querySelector(".player");
    vidEl.pause();


    let checkOverlay = document.querySelector("#wp-overlay-wrapper");
    if(checkOverlay != undefined){
        checkOverlay.style["display"] = "flex";
        return;
    }


    let bd = document.querySelector("body")
    let overlayWrapper = document.createElement("div")
    overlayWrapper.id = "wp-overlay-wrapper";

    let overlay = document.createElement("div");
    overlay.classList.add("wp-overlay");

    let closeDiv = document.createElement("div")
    closeDiv.classList.add("overlay-row")

    let closeImg = document.createElement("img")
    closeImg.id = "wp-close";
    closeImg.src = chrome.runtime.getURL("app/close.png");
    closeDiv.append(closeImg);

    let inpDiv = document.createElement("div")
    inpDiv.classList.add("overlay-row")

    let inpElement = document.createElement("input");
    inpElement.type = "text"
    inpElement.placeholder = "Enter Name";
    inpElement.id = "wp-inp-name";
    let createPartyBtn = document.createElement("div")
    createPartyBtn.id = "wp-create-btn";
    createPartyBtn.innerHTML = "CREATE PARTY";

    inpDiv.append(inpElement, createPartyBtn);

    overlay.append(closeDiv, inpDiv);
    overlayWrapper.append(overlay);

    bd.prepend(overlayWrapper);

    closeImg.addEventListener("click", (e) =>{
        console.log("close clicked");
        checkOverlay = document.querySelector("#wp-overlay-wrapper");
        checkOverlay.style["display"] = "none";

    });

    createPartyBtn.addEventListener("click", async(e) => {
        console.log("createBtn clicked");
        let selfName = inpElement.value;
        if (selfName.length == 0) return;

        let roomIdResponse = await fetch(`${socketUrl3}/createRoom`).then(res => { return res.json() });
        let roomId = roomIdResponse['roomId'];

        console.log(roomId);

        if (extensionInstalled) {

            chrome.runtime.sendMessage({ roomId, selfName }, function (response) {
                console.log(response);
            });

            // chrome.runtime.sendMessage(hwpExtensionId, { roomId, selfName },
            //     function (response) {
            //         console.log({ response })
            //     });
        }

    });

})


function disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
}

function enableScrolling() {
    window.onscroll = function () { };
}
