'use strict';

let newTabId = 0;
console.log("*****")
chrome.runtime.onMessage.addListener(function(req, sender){
    console.log(req);
    if(!newTabId) {
      chrome.tabs.create({
        url:"https://www.baidu.com",
        index: 0
      }, function (tab) {
        newTabId = tab.id;
        console.log(newTabId);
      })
    }
});



