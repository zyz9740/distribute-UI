//
// chrome.runtime.onMessege.addListener(function(request, sender, sendResponse) {
//     if(request === 'start'){
//         sendResponse('[Inject Report]\tSuccess!');
//     }else{
//         sendResponse('[Inject Report]\t???');
//     }
// });

function log(str) {
    console.log(str);
    logDiv.innerHTML += str + "<br>";
}

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
document.body.appendChild(document.createElement("br"));
document.body.appendChild(logDiv);



log("Ready.");

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    log("Got message from background page: " + msg);
});

