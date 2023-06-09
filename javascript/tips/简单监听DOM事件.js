/*
 * @Author: QINJIN
 * @Date: 2023-06-02 16:38:22
 * @LastEditTime: 2023-06-02 16:46:35
 * @LastEditors: QINJIN
 * @Description: Do not edit
 * @FilePath: /tips/简单监听DOM事件.js
 */

/* 很多人还在这样做：
element.addEventListener('type', obj.method.bind(obj))
element.addEventListener('type', function (event) {})
element.addEventListener('type', (event) => {})
上面所有的例子都创建了一个匿名事件监控句柄，且在不需要时无法删除它。这在你不需要某句柄，而它却被用户或事件冒泡偶然触发时，可能会导致性能问题或不必要的逻辑问题。
更安全的事件处理方式如下： */

// 使用引用：
const handler = function () {
  console.log("Tada!");
};
element.addEventListener("click", handler);
// 之后
element.removeEventListener("click", handler);

// 命名的函数移除它本身:
element.addEventListener("click", function click(e) {
  if (someCondition) {
    return e.currentTarget.removeEventListener("click", click);
  }
});

// 更好的写法：
function handleEvent(
  eventName,
  { onElement, withCallback, useCapture = false } = {},
  thisArg
) {
  const element = onElement || document.documentElement;

  function handler(event) {
    if (typeof withCallback === "function") {
      withCallback.call(thisArg, event);
    }
  }

  handler.destroy = function () {
    return element.removeEventListener(eventName, handler, useCapture);
  };

  element.addEventListener(eventName, handler, useCapture);
  return handler;
}

// 你需要的时候
const handleClick = handleEvent("click", {
  onElement: element,
  withCallback: (event) => {
    console.log("Tada!");
  },
});

// 你想删除它的时候
handleClick.destroy();
