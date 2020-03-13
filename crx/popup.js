'use strict';

var bg = chrome.extension.getBackgroundPage();

let confirm = document.getElementById('confirm');

confirm.onclick = function (element) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    bg.sendMessage({type:'CONFIRM'}, tabs[0].id)
  })
};



