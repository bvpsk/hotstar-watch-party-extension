import { loadChatRoomUIV1 } from "./helperMethods.js";
// DOMContentLoaded
let roomId;
let selfName;
let createRoom;
let socketUrl = "https://cherie-party.herokuapp.com"
// let socketUrl = "http://localhost:5555"
window.onload =  function(){

    // let applyBtn = document.querySelector("#sample");
    let nameField = document.querySelector("#name");
    let roomField = document.querySelector("#roomId");
    let joinBtn = document.querySelector("#join");
    let createBtn = document.querySelector("#create");

    joinBtn.addEventListener("click", async(e) => {
        if (nameField.value == null || nameField.value.length == 0 || roomField.value == null || roomField.value.length == 0){
            // Fill fields
            return;
        }
        roomId = roomField.value;
        selfName = nameField.value;
        let roomStatus = await fetch(`${socketUrl}/joinRoom/${roomId}`).then(res => { return res.json() }).then(res => { return res['status'] })
        if(!roomStatus) roomId = null;
        createRoom = false;
        await revampHotstarUI();
    });

    createBtn.addEventListener("click", async(e) => {
        if (nameField.value == null || nameField.value.length == 0) {
            // Fill fields
            return;
        }
        selfName = nameField.value;
        let roomIdResponse = await fetch(`${socketUrl}/createRoom`).then(res => { return res.json() });
        roomId = roomIdResponse['roomId'];
        createRoom = true;
        await revampHotstarUI();
    });

    // { headers: { "Access-Control-Allow-Origin": "*" } }
    // applyBtn.addEventListener("click", async (e) => {

    //     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });



    //     await chrome.scripting.executeScript({
    //         target: { tabId: tab.id },
    //         function: loadChatRoomUIV1,
    //     });

    //     await chrome.scripting.insertCSS({
    //         target: { tabId: tab.id },
    //         files: ["app/wp1.css"]
    //     });

    //     await chrome.scripting.executeScript({
    //         target: { tabId: tab.id },
    //         files: ["app/bj1.js"]
    //     });

    // });
}

async function revampHotstarUI(){

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["app/socket.io.min.js"]
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: loadChatRoomUIV1,
            args: [roomId, selfName, createRoom]
        });

        await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ["app/wp1.css"]
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["app/bj1.js"]
        });

    // loadChatRoomUIV1();
}








// <a href="https://iconscout.com/icons/watching-movie" target="_blank">Watching Movie Icon</a> on <a href="https://iconscout.com">Iconscout</a>