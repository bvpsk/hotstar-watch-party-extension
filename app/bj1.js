let socketUrl2 = "https://cherie-party.herokuapp.com"
// let socketUrl2 = "http://localhost:5555"
function addMessage(msgData, bySelf = true, isStatus = false) {

    let msgText = msgData['text'];

    let msgWrapper = document.createElement("div");
    msgWrapper.classList.add("msg-wrapper");
    if (isStatus) {
        let statusMsg = document.createElement("div");
        statusMsg.className += "status-msg";
        statusMsg.innerHTML = msgText;
        msgWrapper.append(statusMsg);
    } else {

        let from = msgData['from'];
        let timestamp = msgData['timestamp'];

        let msgDiv = document.createElement("div");
        msgDiv.classList.add("msg");
        if (bySelf) {

            // Msg Emitting event

            socket.emit("msg", { text: msgText, from: "You", timestamp: timestamp });

            msgDiv.classList.add("my-msg");
        }
        let msgFrom = document.createElement("div");
        msgFrom.classList.add("msg-from");
        let msgContent = document.createElement("div");
        msgContent.classList.add("msg-content");
        let msgTimestamp = document.createElement("div");
        msgTimestamp.classList.add("msg-timestamp");

        msgFrom.innerHTML = from;
        msgContent.innerHTML = msgText;
        msgTimestamp.innerHTML = getCurrentTimestamp(new Date(timestamp));

        msgDiv.append(msgFrom, msgContent, msgTimestamp);
        msgWrapper.append(msgDiv);
    }

    let messages = document.querySelector("#messages");
    messages.append(msgWrapper);

    messages.scrollTo({ left: 0, top: messages.scrollHeight, behavior: "smooth" }); // To scroll to the bottom msg.
}

function getCurrentTimestamp(date = new Date()) {
    // let date = new Date();
    let hours = date.getHours();
    let hoursMod = hours % 12;
    return `${hoursMod < 10 ? "0" : ""}${hoursMod}:${date.getMinutes()} ${hours >= 12 ? "PM" : "AM"}`;
}

let partyUrl;

let videoElement = document.querySelector(".player");
let msgInput = document.querySelector("#msg-input-content");
// Subtitle Observer
let subtitlesEl = document.querySelector(".shaka-text-container");
let subTitleWrapper = document.querySelector("#subtitles-wrapper");
const subtitlesConfig = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (subtitlesEl.children.length > 0) {
                let subTitleContent = subtitlesEl.children[0].innerHTML;
                let subTitleDiv = document.createElement("div")
                subTitleDiv.classList.add("subtitle");
                subTitleDiv.innerHTML = subTitleContent;
                // subTitleWrapper.children.forEach(st => st.remove());
                subTitleWrapper.innerHTML = "";
                subTitleWrapper.append(subTitleDiv);
            } else {
                // Subtitle deleted
                // subTitleWrapper.children.forEach(st => st.remove());
                subTitleWrapper.innerHTML = "";
            }
        }
    }
});
observer.observe(subtitlesEl, subtitlesConfig);
// Loading data from extension
let dummyRoomIdDiv = document.querySelector("#dummy-room-id");
let dummyNameDiv = document.querySelector("#dummy-name");
let dummyCreateRoomDiv = document.querySelector("#dummy-create-room");
let roomId = dummyRoomIdDiv.innerHTML
let selfName = dummyNameDiv.innerHTML
let isRoomCreated = dummyCreateRoomDiv.innerHTML == "true"
console.log(`RoomId: ${roomId} ; Name: ${selfName} ; isRoomCreated: ${isRoomCreated} : ${typeof(isRoomCreated)}`)

document.querySelector("#send-btn").addEventListener("click", (e) => {
    let msgText = msgInput.value;
    addMessage({ text: msgText, from: "You", timestamp: Date.now() });
    msgInput.value = "";
});

document.querySelector("#leave-btn").addEventListener("click", (e) => {
    console.log("Leaveing party")
    // addMessage({ text: "mmm...Helloo", from: "Homer Simpson", timestamp: "09:25 PM" }, false);
    // addMessage({ text: "Bart Simpson Joined" }, false, true);
    socket.emit("leaveRoom", true);
    socket.disconnect();
    observer.disconnect();
    window.location.href = partyUrl;
});

msgInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        let msgText = msgInput.value;
        addMessage({ text: msgText, from: "You", timestamp: Date.now() });
        msgInput.value = "";
    }
})

// Room ID Share Btn
document.querySelector("#share-btn").addEventListener("click", async (e) => {
    console.log("voila")
    await navigator.clipboard.writeText(`${socketUrl2}/joinParty/${roomId}`).then(function () {
        console.log('Async: Copying to clipboard was successful!');
        addMessage({ text: `Join Party Link Copied to Clipboard` }, false, true);
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
    // let shareData = {
    //     title: 'Hotstar WatchParty',
    //     text: "Hey! I've hosted this party on Hotstar. Sending you an invite to join.",
    //     url: `${socketUrl2}/joinParty/${roomId}`,
    // };

    // try {
    //     await navigator.share(shareData)
    // } catch (err) {
    //     console.log({ err })
    // }
})

// Video Element user events
if(isRoomCreated){
    videoElement.addEventListener("play", (e) => {
        // e.preventDefault();
        // console.log("Video Played", videoElement.currentTime);
        addMessage({ text: `You Played` }, false, true);
        // socket.emit("control", {"sai": "ku"})
        socket.emit("control", { intent: "play", currentTime: videoElement.currentTime, from: selfName, timestamp: Date.now() });
    });

    videoElement.addEventListener("pause", (e) => {
        // e.preventDefault();
        // console.log("Video paused", videoElement.currentTime);
        addMessage({ text: `You Paused` }, false, true);
        socket.emit("control", { intent: "pause", currentTime: videoElement.currentTime, from: selfName, timestamp: Date.now() });
    });

    videoElement.addEventListener("seeked", (e) => {
        // e.preventDefault();
        // console.log("Video seeked", videoElement.currentTime);
        addMessage({ text: `You Seeked` }, false, true);
        socket.emit("control", { intent: "seek", currentTime: videoElement.currentTime, from: selfName, timestamp: Date.now() });
    });
}else{
    videoElement.controls = false;
    videoElement.style["pointerEvents"] = "none";
}

videoElement.currentTime = 0; // Resetting Video
videoElement.pause();


// Socket part
let socket = io(
    socketUrl2,
    {
    query: {
        roomId,
        name: selfName,
        createRoom: isRoomCreated,
        partyUrl: window.location.href
    }
});

socket.on("roomData", (data) => {
    let users = data['users'];
    partyUrl = isRoomCreated ? window.location.href : data["partyUrl"];
    for (userId in users) {
        // addParticipant(users[userId], userId)
    }
});

socket.on("userAdded", (data) => {
    for (userId in data) {
        // addParticipant(data[userId], userId);
        addMessage({ text: `${data[userId]} Joined` }, false, true);
    }
});

socket.on("userLeft", (data) => {
    for (userId in data) {

        addMessage({ text: `${data[userId]} Left` }, false, true);
        // participantsList[userId].remove();
        // delete participantsList[userId];
    }
});


socket.on("msg", (data) => {
    // data["timestamp"] = getCurrentTimestamp(new Date(data["timestamp"]));
    addMessage(data, false)
});

socket.on("control", (data) => {
    // console.log(data)
    // { intent: "seek", currentTime, from: "You", timestamp: Date.now() }
    let {intent, currentTime, from, timestamp, fromHost} = data;
    switch(intent){
        case "play":
            videoElement.play();
            addMessage({ text: `${from} Played` }, false, true);
            break;
        case "pause":
            videoElement.pause();
            addMessage({ text: `${from} Paused` }, false, true);
            break;
        case "seek":
            videoElement.currentTime = currentTime;
            addMessage({ text: `${from} Seeked` }, false, true);
            break;
    }
    // console.log(intent, currentTime, from, timestamp, fromHost)
});



function subtitlesCallbackForObserver(subtitleEl){
    return (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (subtitleEl.children.length > 0){
                    console.log(subtitleEl.children[0].innerHTML)
                }else{
                    // Subtitle deleted
                }
        }
        }
    }
}
