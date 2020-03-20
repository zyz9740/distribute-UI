'use strict';

let lastTabId = 0;

chrome.runtime.onMessage.addListener(function(req, sender){
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
        data: req.content,
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

});



