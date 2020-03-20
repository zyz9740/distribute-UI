

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

function handleClick(event) {
    log(`Mouse at (${event.clientX}, ${event.clientY})`, 'capture');
    event.preventDefault();
    event.stopImmediatePropagation();   // stop the catch propagation
    if (collection.length) collection[0].style.border = oldBorderStyle;
    collection = [];
    findDom(event.clientX, event.clientY, document.documentElement);
    if (collection) {
        let target = collection[0];
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
}

function confirm() {
    log('Capture completed', 'shutdown');

    if(collection){
        let target = collection[0];
        target.style.border = oldBorderStyle;
        let subtree = target.outerHTML;
        let css = splitStyle(target);
        log(subtree, 'info');
        log(css, 'info');
        chrome.runtime.sendMessage({'content': {
                'subtree': JSON.stringify(subtree),
                'css':  JSON.stringify(css)
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

function Queue(){
    var nodes = [];
    const maxLength = 100;
    var front=0, tail = 0;
    function push(node){
        nodes[tail] = node;
        tail++;
        if(tail >= maxLength) tail = tail % maxLength;
    }
    function pop() {
        let top = nodes[front];
        front++;
        if(front >= maxLength) front = front % maxLength;
        return top;
    }
    function printNodes() {
        for(let i = front;i<tail;i++){
            console.log(nodes[i], ' ')
        }
    }
    function isEmpty() {
        return front === tail;
    }
    return {push, pop, printNodes, isEmpty};
}

/**
 * 判断父节点与子节点的样式不同
 * @param parent
 * @param child
 * @returns {Array}
 */
function diff(parent, child) {
    let parentStyle = window.getComputedStyle(parent);
    let childStyle = window.getComputedStyle(child);
    let length = parentStyle.length;
    let diffStyleCollection = [];
    for(let i=0;i<length;i++){
        let property = parentStyle[i];
        // TODO: 默认样式的去除，比如<p>默认display是inline
        // TODO: CSS样式的筛选
        if(parentStyle[property] !== childStyle[property]){
            diffStyleCollection.push({'property':property, 'value':childStyle[property]})
        }
    }
    return diffStyleCollection;
}

/**
 * 从root节点分离相关的CSS
 * @param root
 * @returns {{rootStyle: CSSStyleDeclaration, childStyle: Array}}
 */

function splitStyle(root) {
    var rootStyle = window.getComputedStyle(root);
    var childrenStyle = [];
    var q = Queue();
    q.push(root);
    while(!q.isEmpty()){
        let parent = q.pop();
        let children = parent.childNodes;
        for(let i=0;i<children.length;i++){
            let child = children[i];
            // Delete the non-Element tag, <script>, <style> ...
            // TODO: 删除Dom中的一些无意义节点
            if(child instanceof Element && child.tagName !== "SCRIPT" && child.tagName !== "STYLE") {
                q.push(children[i]);
                childrenStyle.push(diff(parent, children[i]));
            }
        }
    }
    return {'rootStyle':rootStyle, 'childStyle':childrenStyle};
}



