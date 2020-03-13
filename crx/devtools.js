var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.name == 'confirm'){
        chrome.devtools.inspectedWindow.eval("$0.outerHTML", {}, function (result) {
            // if executing script fails, result will be undefined
            backgroundPageConnection.postMessage({name: 'element', content: result})
        })
    }
});

//TODO: listen to the close action of dectools
