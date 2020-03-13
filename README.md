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

- Now, we can click the CAPTURE button to select a UI element in the web and click the CONFIRM button to open  www.baidu.com in a new tab.The extension background has receive the element but we need a dynamic page provided by a remote server.
- So, we should establish a local server that can receive the element we send and send back a HTML page that contain the element. This is Step One, we will pick up my OLD Django tomorrow.
- Besides, Step Two, we need to optimize our algorithm of detach element. Up to now, we can only do some simple detaching work.
- Step Three, dealing with some CSS and JS problems, but it need long long long long long after.

**Meterial**

- How to comprehend event propagation：https://www.quirksmode.org/js/events_order.html#link4

- How stop catch propagation:  event.preventDefault() & event.stopPropagation()

### 2020.3.11

**Work**

- Today, we set up a server running at http://localhost:8000/service with Django. we can use the server to process the UI element and render a page back to chrome. Process is as following:
  - First, we click the CAPTURE button to select a UI element. A blue border will occur surronding the element. 
  - Then, click the CONFIRM button to send the element to sever, the server will render a HTML page back to the web. Beside, a backup will be stored in database. By using a server, a remote UI distribution will come true in the future work.
  - Or, you can click the CANCEL button to cancel the capture behavior.
- Our next step is optimizing our select algorithm. 頑張れ!

### 2020.3.13

**Work**
- Change the method of select HTML element from user's click action to Chrome local devtools. now, users need to open the inspect console to select element.The reason for this is that by using Chrome devtools users can select the element more precisely
- We build a new branch called devtools to separate between the two method of element selection.

**Future**

We complete the top two "Overlook" in 3.10's notes. Now, we should give a more specific description of step three.
- First, as to the style of element. We have two approaches. 
    - One is copy all stylesheet, depending on the remote browser to render it.
    - One is separate related styles as well, I think this is more challenging and meaningful. So I'd like to learn more about CSS render rules, including but not limited to:
        - The method that web browser uses to render the HTML element from a data structure built by CSS
        - How to present the separated CSS and use that to reconstruct UI element
- Second, about javascript, I wanna to build a JS RPC structure. But more knowledge should be learned.
- Third, reading related papers. Some coding experience has receive, it's time to learn widely from others perspective.
