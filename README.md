# distribute-UI
The repository that record the progress of my undergraduate graduation design

### 2020.3.9
- Learn the development of Chrome extension from the following website:
  - Tutorial:   https://developer.chrome.com/extensions/getstarted
  - Samples:    https://developer.chrome.com/extensions/samples
  - Discussion: https://www.zhihu.com/question/20179805
  - Communication between these pages: https://juejin.im/post/5c135a275188257284143418
- Try to write a piece of code that users could click the popup button to trigger the inject code.

### 2020.3.10

**Work & Overlook**

- now, we can click the CPATURE button to select a UI element in the web and click the DETACH button to open  www.baidu.com in a new tab.The extension background has receive the element but we need a dynamic page provided by a remote server.
- So, we should establish a local server that can receive the element we send and send back a HTML page that contain the element. This is Step One, we will pick up my OLD Django tomorrow.
- Besides, Step Two, we need to optimize our algorithm of detach element. Up to now, we can only do some simple detaching work.
- Step Three, dealing with some CSS and JS problems, but it need long long long long long after.

**Meterial**

- How to comprehend event propagation：https://www.quirksmode.org/js/events_order.html#link4

- How stop catch propagation:  event.preventDefault() & event.stopPropagation()