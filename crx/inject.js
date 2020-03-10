

function log(str, type) {
    console.log(str);
    if(type)
        logDiv.innerText += `[${type.toUpperCase()}]:\t${str}\n`;
    else
        logDiv.innerText += str + "\n";
}

// When WebContentLoaded
// print log on the page
let logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
let logPos = 'TAIL';
if(logPos === 'HEAD') {
    document.body.insertBefore(logDiv, document.body.firstChild);
    document.body.insertBefore(document.createElement("br"), document.body.firstChild);
}else{
    document.body.appendChild(document.createElement('br'));
    document.body.append(logDiv);
}

log("Ready.",'info');


/*
    Capture
 */

let collection = [];
let oldBorderStyle = null;

function isContain(mouseX, mouseY, dom) {
    if(!dom.getBoundingClientRect) return false;
    let rect = dom.getBoundingClientRect();
    return  mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;
}

function findDom(mouseX, mouseY, dom) {
    if(isContain(mouseX, mouseY, dom)){
        let children = dom.childNodes;
        for(let i=0;i<children.length;i++){
            findDom(mouseX, mouseY, children[i])
        }
        collection.push(dom);
    }
}

function capture() {
    log('Capture start', 'capture');
    try {
        document.documentElement.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();   // stop the catch propagation
            if (collection.length) collection[0].style.border = oldBorderStyle;
            collection = [];
            log(`Mouse at (${event.clientX}, ${event.clientY})`, 'capture');
            findDom(event.clientX, event.clientY, document.documentElement);
            if (collection) {
                let target = collection[0];
                oldBorderStyle = target.style.border;
                target.style.border = '1px solid blue';
                log(target.outerHTML, 'capture');
            } else log("no element selected", 'capture')
        },true);
    }catch (e) {
        log(e, 'error')
    }
}

function shutdown() {
    log('Capture completed', 'shutdown');
    if(collection){
        let target = collection[0];
        log(target.outerHTML, 'info')
        chrome.runtime.sendMessage({'content': target.outerHTML})
    }else{
        log('No element is selected.Exit.','info')
    }
}

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    log("Got message from background page: " + msg, 'info');
    switch (msg.type) {
        case 'CAPTURE':
            capture();break;
        case 'SHUTDOWN':
            shutdown();break;
        default:
            log('Unhandled message.', 'error')
    }
});

