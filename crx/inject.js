

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
 * Split valid CSS property from subtree whose root is variable root.
 * @param root
 * @returns {Array}
 */

function splitStyle(root) {
    var stylesBybfsOrder = [];
    stylesBybfsOrder.push(getValidStyles(root));
    var q = Queue();
    q.push(root);
    while(!q.isEmpty()){
        let parent = q.pop();
        let children = parent.childNodes;
        for(let i=0;i<children.length;i++){
            let child = children[i];
            // 删除Dom中的一些不可视节点
            if(isVisible(child)) {
                q.push(children[i]);
                stylesBybfsOrder.push(getValidStyles(child))
            }
        }
    }
    return stylesBybfsOrder;
}

/***
 * Get the non-default style property of ele
 * @param ele
 * @returns {Array}
 */
function getValidStyles(ele) {
    var stylePropertyMapReadOnly = ele.computedStyleMap();
    var styles = [];
    var defaultStyles = document.getElementsByTagName('html')[0].computedStyleMap()
    for(const [property, value] of stylePropertyMapReadOnly ){
        // 删除默认值属性
        if(defaultStyles.get(property) !== value.toString() && nonZero(value.toString()))
            styles.push({'property':property, 'value': value.toString()})
    }
    return styles;
}

function nonZero(value) {
    let emptyExp = ['0px', '0', 'none', 'auto','normal'];
    for(let i=0;i<emptyExp.length;i++){
        if(value === emptyExp[i]) return false
    }
    return true
}

/**
 * Return the visibility of ele
 * @param ele
 * @returns {boolean}
 */
function isVisible(ele) {
    console.log(ele);
    let visible;
    if(ele.computedStyleMap)
        visible = ele.computedStyleMap().get('display');
    return ele instanceof Element && ele.tagName !== "SCRIPT" && ele.tagName !== "STYLE" && visible !== 'none'
}



