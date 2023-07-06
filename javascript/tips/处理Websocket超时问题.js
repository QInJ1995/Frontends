/*
 * @Author: QINJIN
 * @Date: 2023-06-02 16:41:10
 * @LastEditTime: 2023-06-02 16:43:40
 * @LastEditors: QINJIN
 * @Description: Do not edit
 * @FilePath: /tips/处理Websocket超时问题.js
 */

/* 在 websocket 连接被建立后，如果一段时间未活动，服务器或防火墙可能会超时或终止连接。想要解决这个问题， 我们可以周期性地给服务器发消息。
我们需要两个方法实现：一个来确保连接不会中断，，另一个用来取消此设定。同我们也需要一个 timerID 变量.
让我们来看一下具体实现： */

var timerID = 0;
function keepAlive() {
  var timeout = 20000;
  if (webSocket.readyState == webSocket.OPEN) {
    webSocket.send("");
  }
  timerId = setTimeout(keepAlive, timeout);
}
function cancelKeepAlive() {
  if (timerId) {
    clearTimeout(timerId);
  }
}
