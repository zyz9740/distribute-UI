'use strict';

let lastTabId = 0;

// communication with popup
function sendMessage(msg, tabId){
    console.log("Send message\t:", msg, " to tab:\t", tabId);
    let port = connections[tabId];
    if(port){
        port.postMessage({name: 'confirm'})
    }else{
        console.log("Open the devtools");
    }
}

//communication with devtools
var connections = {};       // mapping the tabId to port

chrome.runtime.onConnect.addListener(function (port) {
    console.log("Receive connection from dev.")

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(function (message, sender, sendResponse) {
        console.log(message);
        if(message.name == 'element'){
            if(message.content) {
                send2Server({content: message.content})
            }else{
                console.log("Error in devtools");
            }
        } else if(message.name == 'init'){
            connections[message.tabId] = port;
            console.log("Init tabId:", message.tabId);
            return;
        }
    });
});


function send2Server(req){
    console.log(req.content);
    // Close the last page if it exists
    if(lastTabId) {
        chrome.tabs.remove(lastTabId, function () {
            console.log("Tab ", lastTabId ," has been closed.")
        })
    }
    // Pass the UI element to server and Get the display page
    $.ajax({
        url: 'http://127.0.0.1:8000/service/receiver/',
        type: 'POST',
        data: {'content': req.content},
        dataType: 'json',
        async: true,
    }).then(function(res){
        console.log("response:" + res);
        // Create new page according to the response
        chrome.tabs.create({url:res, index:0}, function (newTab) {
            lastTabId = newTab.id;
            console.log("Create new tab in tabId: ", newTab.id);
        })

    });
};



