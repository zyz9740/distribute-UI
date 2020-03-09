let topDiv = document.getElementById('topDiv');
let midDiv = document.getElementById('midDiv');
let text = document.getElementById('text');

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

document.documentElement.addEventListener('click', function (event) {
    if(collection.length) collection[0].style.border = oldBorderStyle;
    collection = [];
    console.log(`Nouse at (${event.clientX}, ${event.clientY})`);
    findDom(event.clientX, event.clientY, document.documentElement);
    console.log(collection);
    if(collection) {
        let target = collection[0];
        oldBorderStyle = target.style.border;
        target.style.border = '1px solid blue';
    }else alert("no select")
});
