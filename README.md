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



### 2020.3.20

​		周三跟导师讨论了一下相关的事情，然后这周一周二是在看论文，后面几天在做分离CSS的事情，现在记录一下这一周相关的心得。



**Proposal from tutor**

- 跟本方向有关的论文会议
  - MobiSys，MobiCom Sensys，MOBIHCI，ISSRE，INFOCOM，：移动系统
  - CHI：UI设计
  - OSDI, NSDI,Eurosys, ATC ：系统
  -  FSE/ASE/ICSE/ISSTA：这四个主要是测试，debug这些
  - USENIX/CCS/S&P/NDSS：这四个是安全

- 阅读论文的原则：

  - 【筛选论文】筛选论文的第一原则是看这篇论文被那个会议收录了，是不是上面说的这个会议，如果是就证明这个论文是比较牛的，否则就不用看这个论文了，因为水的论文是不会被会议收录的。
  - 【筛选论文】浏览论文的时候只看abs即可，整体论文的流程控制在5min之内。如果5min你没看懂他在讲什么，那么这篇论文也没有看的必要了。
  - 【查找相关文章】浏览引文，特别是比较牛的文章，他引用的也会比较牛，相关题材的可以看一看
  - 【查找相关文章 】除了引文 cited by 的文章也可以看看，这是向后的查找 
  - 【论文整理】可以做一个论文的 graph，把有意义的论文都联系起来。

- Q & A：

  - Q：为什么要使用Chrome插件，原因是什么？技术选型的时候需要合理有用，不能跑偏耽误额外的时间。

    A：现在看来Chrome插件的好处是可以比较好的用合理的方式去规避 同源策略。当然好像 JSONP 之类的技术手段也可以，https://www.cnblogs.com/rain-chenwei/p/9520240.html，但我没有尝试过。

  - Q：现在这个技术的扩展性如何，如果要拓展到别的浏览器或者移动端是否可行？

    A：这个技术的核心是在于那一段嵌入的 JS 代码，如果这一段 JS 代码是架构无关的，或者做好架构适配的，那么其实移植到别的平台上只在 【1、如何嵌入 JS】【 2、如何进行展示】这两个方面有区别。

  - Q：这个技术剩下的挑战是什么？需要把他们列出来，然后加上自己的思考，其实就是一篇论文的雏型了。

    A：整理在后面。

    

**Work**

​		这次主要做了一些跟CSS分离相关的操作，有考虑过许多其他的处理方法，但是最后还是决定采用了【动态获取，动态插入】的方法。

- 获取：

  - 首先，获取subtree根节点的所有属性，作为默认样式 rootStyle;
  - 然后按照BFS的顺序，记录每个节点与父节点的属性的差异值，将差异值记录下来作为这个节点的 uniStyle，按照BFS的顺序组合为childrenStyle。这样做的目的是减少需要记录的CSS的信息，利用了某些CSS组件默认从父组件继承这一特性。

- 序列化：利用 JSON.stringfy 将 object 进行序列化，利用ajax进行网络请求

  ```
  {
  	rootStyle: CSSStyleDeclaration,
  	childrenStyle:[
      [
        {
          property:	string,
          value: string,
        },
        ...
      ],
      ...
    ]
  }
  ```

- 处理：服务端利用序列化的数据，渲染html文件发送到 guest 端。

- 重构：根据服务端发送的数据，按照BFS的顺序利用JS动态的添加到Dom tree中，完成渲染。



**TODO in current work**

- 通过测试找问题
- 现在要传递的CSS根节点的属性有280个之多，我们需要花费一定时间去筛选这里面的一些不必要的CSS属性，比如绝对位置之类的





**Chanllege**

- 如何通过用户的鼠标事件确定组件呢？我们现在的方案使用过鼠标触点的位置来查找，最精确的是通过devtools来直接定位subtree，也可以通过给每个组件添加事件（性能问题、冲突问题）来完成。
- 如何解决所谓【最小组件】的问题？通过相关的论文会发现这种 DUI 是区分面向 developer 和面向 user 的，如何解决user选择组件的随意性问题呢？
- 如何解决host和guest的interaction问题？是接下来的重点工作，是使用全局变量还是RPC或者传递event的方式？
- subtree内部的CSS问题解决了之后，如何解决目标的适配问题？
- 性能问题也需要等到整个系统做出来之后进行考量。