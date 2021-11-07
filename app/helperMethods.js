function loadChatRoomUIV1(rId, sName, isRoomCreated, tabUrl) {

    // LOAD SOCKET.IO CDN BUNDLE
    // let socketScript = document.createElement("script");
    // socketScript.src = "https://cdn.socket.io/4.3.2/socket.io.min.js"
    // socketScript.integrity = "sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs"
    // socketScript.crossOrigin = "anonymous"
    // socketScript.onload = function () {
    //     this.remove();
    // };
    // document.querySelector("head").append(socketScript);

    // Store Name and RoomID and createRoom values within divs and push them to body
    let bodyRef = document.querySelector("body");
    let dummyRoomIdDiv = document.createElement("div");
    // this.roomId = "kum sai"
    dummyRoomIdDiv.innerHTML = rId;
    dummyRoomIdDiv.id = "dummy-room-id";
    let dummyNameDiv = document.createElement("div");
    dummyNameDiv.innerHTML = sName;
    dummyNameDiv.id = "dummy-name";
    let dummyCreateRoomDiv = document.createElement("div");
    dummyCreateRoomDiv.innerHTML = isRoomCreated;
    dummyCreateRoomDiv.id = "dummy-create-room";
    bodyRef.append(dummyRoomIdDiv, dummyNameDiv, dummyCreateRoomDiv);


    let vidEl = document.querySelector(".player");
    document.querySelectorAll("body > *").forEach(d => { d.style["display"] = "none" })
    bodyRef.style["backgroundColor"] = "white"
    document.querySelector("html").style["backgroundColor"] = "white"
    vidEl.id = "video-div"

    let previewSec = document.createElement("section")
    previewSec.id = "preview"

    let resizerSec = document.createElement("section")
    resizerSec.id = "resizer"

    let chatSec = document.createElement("section")
    chatSec.id = "chat-wrapper"

    // Subtitles
    let subTitleWrapper = document.createElement("div")
    subTitleWrapper.id = "subtitles-wrapper";

    // Header
    let chatHeader = document.createElement("div")
    chatHeader.classList.add("chat-header");
    let logoImg = document.createElement("img")
    logoImg.classList.add("logo");
    logoImg.src = chrome.runtime.getURL("app/icon.png");
    let roomDetails = document.createElement("div")
    roomDetails.classList.add("room-details");
    let roomIdWrapper = document.createElement("div");
    roomIdWrapper.classList.add("roomid-wrapper");
    let roomIdDiv = document.createElement("div")
    roomIdDiv.id = "room-id";
    roomIdDiv.innerHTML = rId;
    let roomIdShare = document.createElement("div");
    roomIdShare.id = "share-btn";
    let shareImg = document.createElement("img");
    shareImg.src = chrome.runtime.getURL("app/share.png");
    shareImg.classList.add("room-share-img")
    roomIdShare.append(shareImg);
    roomIdWrapper.append(roomIdDiv, roomIdShare);
    roomDetails.append("ROOM ID", roomIdWrapper);
    let leaveBtn = document.createElement("div")
    leaveBtn.id = "leave-btn";
    leaveBtn.innerHTML = "LEAVE"
    chatHeader.append(logoImg, roomDetails, leaveBtn);
    chatSec.append(chatHeader);


    // <div class="roomid-wrapper">
    //     <div id="room-id">123456</div>
    //     <div id="share-btn">
    //         <img src="share.png" width="100%" />
    //     </div>
    // </div>

    // Messages
    let messages = document.createElement("div")
    messages.id = "messages";
    chatSec.append(messages);

    // Message Input
    let msgInput = document.createElement("div")
    msgInput.classList.add("msg-input");
    let inpElement = document.createElement("input");
    inpElement.type = "text"
    inpElement.placeholder = "Enter your message";
    inpElement.id = "msg-input-content";
    let sendBtn = document.createElement("div")
    sendBtn.id = "send-btn";
    sendBtn.innerHTML = "SEND";
    msgInput.append(inpElement, sendBtn);
    chatSec.append(msgInput);


    vidEl.style.display = "block"
    vidEl.controls = true
    previewSec.append(vidEl, subTitleWrapper)
    bodyRef.prepend(previewSec, resizerSec, chatSec)



    // THIS SNIPPET IS USED TO EXECUTE SCRIPT VIA HTML DOM
    // let scr1 = document.createElement("script");
    // scr1.src = chrome.runtime.getURL("app/bj1.js");
    // scr1.onload = function () {
    //     this.remove();
    // };
    // bodyRef.append(scr1);
}

function Version(){
    return "HWP-V1"
}

export { loadChatRoomUIV1, Version };