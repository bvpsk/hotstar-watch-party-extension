import { loadChatRoomUIV1 } from "./app/helperMethods.js";
let partyDetails = {};

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        // if (tab.url.indexOf("hotstar") != -1) {
        if (tab.url == partyDetails['partyUrl']) {
            // if (tab.url.indexOf("movies") != -1){
            //     if (tab.url.indexOf("watch") == -1) return;
            // }
            // if (tab.url.indexOf("tv") != -1) {
            //     if (countNumeralStrings(tab.url.split("/")) != 2) return;
            // }
            // console.log(partyDetails);
            // if(tab.url == partyDetails['partyUrl']){
                await sleep(10000);
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["app/socket.io.min.js"]
                });

                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: loadChatRoomUIV1,
                    args: [partyDetails['roomId'], partyDetails['userName'], false]
                });

                await chrome.scripting.insertCSS({
                    target: { tabId: tab.id },
                    files: ["app/wp1.css"]
                });

                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["app/bj1.js"]
                });
            // }

            partyDetails = {};
        }
        if (partyDetails['partyUrl'] == undefined && tab.url.indexOf("hotstar") != -1){ // Pages to show hotstar watch party option
            console.log("This is a hotstar page without a join session :", tab.url);
            if (tab.url.indexOf("bookmark") != -1) return;
            if (tab.url.indexOf("movies") != -1){
                if (tab.url.indexOf("watch") == -1) return;
            }
            else if (tab.url.indexOf("tv") != -1) {
                if (countNumeralStrings(tab.url.split("/")) < 2) return;
            }else{
                return;
            }

            // Styles and logic for showing watch party option
            console.log("Applying WP Icon Logic for Page : " + tab.url, {tab, changeInfo})
            await sleep(5000);

            await pushExtensioIdToPage(tab.id);

            // await chrome.scripting.executeScript({
            //     target: { tabId: tab.id },
            //     files: ["app/socket.io.min.js"]
            // });

            // await chrome.scripting.insertCSS({
            //     target: { tabId: tab.id },
            //     files: ["app/wp1.css"]
            // });

            await chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ["app/watchParty.css"]
            });

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["app/watchParty.js"]
            });

        }
        // https://cherie-party.herokuapp.com
        if (tab.url.indexOf("cherie-party") != -1 && tab.url.indexOf("joinParty") != -1){
            await pushExtensioIdToPage(tab.id);
        }

    }
});

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        console.log(sender.tab);

        
            // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (sender.url.indexOf("hotstar") == -1) return;

        let roomId = request["roomId"];
        let selfName = request["selfName"];
        console.log({roomId, selfName});
        await chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ["app/socket.io.min.js"]
        });

        await chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            function: loadChatRoomUIV1,
            args: [roomId, selfName, true]
        });

        await chrome.scripting.insertCSS({
            target: { tabId: sender.tab.id },
            files: ["app/wp1.css"]
        });

        await chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ["app/bj1.js"]
        });

    }
);

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (sender.url.indexOf("cherie-party") != -1 && sender.url.indexOf("joinParty") != -1){
            partyDetails = request["roomData"];
            console.log("from JP", {partyDetails})
        } else if (sender.url.indexOf("hotstar") != -1){
            console.log("from HOTSTAR", sender.url, request)
        }
        // console.log("from lc", {partyDetails})
        // if (sender.url === blocklistedWebsite)
        //     return;  // don't allow this web page access
        // if (request.openUrlInEditor)
        //     openUrl(request.openUrlInEditor);
    }
);

async function pushExtensioIdToPage(tabId){
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
            let bodyRef = document.querySelector("body");
            let sampleDiv = document.createElement("div");
            sampleDiv.id = "extension-present";
            sampleDiv.innerHTML = chrome.runtime.id;
            sampleDiv.style["display"] = "none";
            bodyRef.prepend(sampleDiv);
        },
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function countNumeralStrings(ArrOfStrs){
    let count = 0;
    ArrOfStrs.forEach(str => {
        if(!isNaN(Number(str))) count += 1;
    });
    return count;
}