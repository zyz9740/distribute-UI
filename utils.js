// let example = document.childNodes[1].childNodes[2].childNodes[1];
// let subtree = example.outerHTML;
// let cssSerialization = splitStyle(example);
// let request = {
//     'subtree': subtree,
//     'cssSerialization': cssSerialization
// };
// console.log(request);
// send2Server(request);


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

/**
 * 发送消息给server
 * @param req
 */
function send2Server(req){
    console.log(req)
    $.ajax({
        url: 'http://127.0.0.1:8000/service/receiver/',
        type: 'POST',
        data: {'content': req},
        dataType: 'json',
        async: true,
        processData: false
    }).then(function(res){
        console.log("response:" + res);
        // Create new page according to the response
        // chrome.tabs.create({url:res, index:0}, function (newTab) {
        //     lastTabId = newTab.id;
        //     console.log("Create new tab in tabId: ", newTab.id);
        // })
    });
};
