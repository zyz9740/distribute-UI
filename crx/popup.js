// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
//
// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };

let start =  document.getElementById('start');
let complete = document.getElementById('shutdown');
let cancel = document.getElementById('cancel');

function sendMessage(msg, tabId){
  if(tabId){
    chrome.tabs.sendMessage(tabId, msg);
  }else{
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      let lastTabId = tabs[0].id;
      chrome.tabs.sendMessage(lastTabId, msg);
    });
  }
}

start.onclick = function (element) {sendMessage({type:'START'});};
complete.onclick = function (element) {sendMessage({type:'CONFIRM'})};
cancel.onclick = function (element) {sendMessage({type:'CANCEL'})};



