

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


let collection = [];
let targetId = '';
let oldBorderStyle = null;
let hintBorderStyle = '1px solid blue';

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

function loadCSSCors(stylesheet_uri) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', stylesheet_uri);
    xhr.onload = function() {
        xhr.onload = xhr.onerror = null;
        if (xhr.status < 200 || xhr.status >= 300) {
            console.error('style failed to load: ' + stylesheet_uri);
        } else {
            console.log('get ', stylesheet_uri ,' successfully');
            var style_tag = document.createElement('style');
            style_tag.appendChild(document.createTextNode(xhr.responseText));
            document.head.appendChild(style_tag);
        }
    };
    xhr.onerror = function() {
        xhr.onload = xhr.onerror = null;
        console.error('XHR CORS CSS fail:' + styleURI);
    };
    xhr.send();
}

// TODO: 父属性的继承rule无法获取
function splitCssByRules(root) {
    let splitRules = "";
    let styleSheets = document.styleSheets;

    for(let styleSheet of styleSheets){
        try {
            for (let cssRule of styleSheet.cssRules) {
                let ele = root.querySelector(cssRule.selectorText)
                if (ele) {
                    splitRules += cssRule.cssText
                    splitRules += '\n'
                }
            }
        }catch (e) {
            if (e instanceof DOMException){}
        }
    }
    return splitRules
}

function handleClick(event) {
    log(`Mouse at (${event.clientX}, ${event.clientY})`, 'capture');
    event.preventDefault();
    event.stopImmediatePropagation();   // stop the catch propagation
    if (collection.length) collection[0].style.border = oldBorderStyle;
    collection = [];
    findDom(event.clientX, event.clientY, document.documentElement);
    if (collection) {
        let target = collection[0];
        // Show hint border
        oldBorderStyle = window.getComputedStyle(target)['border'];
        log('Old border style:' + oldBorderStyle, 'info')
        target.style.border = hintBorderStyle;
        if(target.id) targetId = target.id;
        else targetId = "DUI-target";
        log("UI id: " + targetId, 'capture');
    } else log("no element selected", 'capture')
}

function start() {
    log('Capture start', 'capture');
    document.documentElement.addEventListener('click', handleClick,true);

    // Get cross domain style sheet
    for(let styleSheet of document.styleSheets){
        try {
            let cssRules = styleSheet.cssRules;
        }catch (e) {
            if (e instanceof DOMException){
                loadCSSCors(styleSheet.href)
            }
        }
    }

}

function confirm() {
    log('Capture completed', 'shutdown');
    if(collection){
        let target = collection[0];
        log(target.outerHTML, 'info');
        // Recover origin border style
        target.style.border = oldBorderStyle;
        let subtree = target.outerHTML;
        let cssRules = splitCssByRules(target);
        log(subtree, 'info');
        log(cssRules, 'info');
        chrome.runtime.sendMessage({'content': {
                'subtree': JSON.stringify(subtree),
                'css':  JSON.stringify(cssRules)
            }})
    }else{
        log('No element is selected.Exit.','info')
    }
}

function cancel(){
    document.documentElement.removeEventListener('click', handleClick, true)
    let target = document.getElementById(targetId);
    target.style.border = oldBorderStyle;
    oldBorderStyle = [];
    collection = [];
    targetId = "";
}

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    log("Got message from background page: " + msg.type, 'info');
    switch (msg.type) {
        case 'START':
            start();break;
        case 'CONFIRM':
            confirm();break;
        case 'CANCEL':
            cancel();break;
        default:
            log('Unhandled message.', 'error')
    }
});

