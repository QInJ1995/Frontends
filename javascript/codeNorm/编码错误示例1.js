/*
 * @Author: QINJIN
 * @Date: 2023-08-28 11:44:48
 * @LastEditors: QINJIN
 * @LastEditTime: 2023-08-28 14:15:07
 * @FilePath: /Frontends/javascript/codeNorm/编码错误示例1.js
 * @Description: 编码错误示例1
 * Copyright
 */

/** 变量解构一解就报错 */
// 优化前：
const App1 = (props) => {
  const { data } = props;
  const { name, age } = data;
};

// 解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于 undefined 、null 无法转为对象，所以对它们进行解构赋值时都会报错。
// 所以当 data 为 undefined 、null 时候，上述代码就会报错。

// 优化后：
const App2 = (props) => {
  const { data } = props || {};
  const { name, age } = data || {};
};

/** 二、不靠谱的默认值 */
// 再优化一下：
const App3 = (props = {}) => {
  const { data = {} } = props;
  const { name, age } = data;
};

// ES6 内部使用严格相等运算符（===）判断一个变量是否有值。所以，如果一个对象的属性值不严格等于 undefined ，默认值是不会生效的。
// 所以当 props.data 为 null，那么 const { name, age } = null 就会报错！

/** 三、数组的方法只能用真数组调用 */
// 优化前：
const App4 = (props) => {
  const { data } = props || {};
  const nameList = (data || []).map((item) => item.name);
};

// 那么问题来了，当 data 为 123 , data || [] 的结果是 123，123 作为一个 number 是没有 map 方法的，就会报错。
// 数组的方法只能用真数组调用，哪怕是类数组也不行。如何判断 data 是真数组，Array.isArray 是最靠谱的。

// 优化后：
const App5 = (props) => {
  const { data } = props || {};
  let nameList = [];
  if (Array.isArray(data)) {
    nameList = data.map((item) => item.name);
  }
};

/** 四、数组中每项不一定都是对象 */
// 优化前：
const App6 = (props) => {
  const { data } = props || {};
  let infoList = [];
  if (Array.isArray(data)) {
    infoList = data.map((item) => `我的名字是${item.name},今年${item.age}岁了`);
  }
};

// 一旦 data 数组中某项值是 undefined 或 null，那么 item.name 必定报错，可能又白屏了。

// 优化后：
const App7 = (props) => {
  const { data } = props || {};
  let infoList = [];
  if (Array.isArray(data)) {
    infoList = data.map(
      (item) => `我的名字是${item?.name},今年${item?.age}岁了`
    );
  }
};

// ? 可选链操作符，虽然好用，但也不能滥用。item?.name 会被编译成 item === null || item === void 0 ? void 0 : item.name，滥用会导致编辑后的代码大小增大。

// 二次优化后：
const App8 = (props) => {
  const { data } = props || {};
  let infoList = [];
  if (Array.isArray(data)) {
    infoList = data.map((item) => {
      const { name, age } = item || {};
      return `我的名字是${name},今年${age}岁了`;
    });
  }
};

/** 五、对象的方法谁能调用 */
// 优化前：
const App9 = (props) => {
  const { data } = props || {};
  const nameList = Object.keys(data || {});
};
// 只要变量能被转成对象，就可以使用对象的方法，但是 undefined 和 null 无法转换成对象。对其使用对象方法时就会报错。

// 优化后：
const _toString = Object.prototype.toString;
const isPlainObject = (obj) => {
  return _toString.call(obj) === "[object Object]";
};
const App10 = (props) => {
  const { data } = props || {};
  const nameList = [];
  if (isPlainObject(data)) {
    nameList = Object.keys(data);
  }
};

/** 六、async/await 错误捕获 */
// 优化前：
import React, { useState } from "react";

const App11 = () => {
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const res = await queryData();
    setLoading(false);
  };
};

// 如果 queryData() 执行报错，那是不是页面一直在转圈圈。

// 优化后：
import React, { useState } from "react";
const App12 = () => {
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    try {
      const res = await queryData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
};

// 如果使用 trycatch 来捕获 await 的错误感觉不太优雅，可以使用 await-to-js 来优雅地捕获。

// 二次优化后：
import React, { useState } from "react";
import to from "await-to-js";

const App13 = () => {
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const [err, res] = await to(queryData());
    setLoading(false);
  };
};

/** 七、不是什么都能用来JSON.parse */
// 优化前：
const App14 = (props) => {
  const { data } = props || {};
  const dataObj = JSON.parse(data);
};

// JSON.parse() 方法将一个有效的 JSON 字符串转换为 JavaScript 对象。这里没必要去判断一个字符串是否为有效的 JSON 字符串。只要利用 trycatch 来捕获错误即可。

// 优化后：
const App15 = (props) => {
  const { data } = props || {};
  let dataObj = {};
  try {
    dataObj = JSON.parse(data);
  } catch (error) {
    console.error("data不是一个有效的JSON字符串");
  }
};

/** 八、被修改的引用类型数据 */
// 优化前：
const App16 = (props) => {
  const { data } = props || {};
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item) item.age = 12;
    });
  }
};

// 如果谁用 App 这个函数后，他会搞不懂为啥 data 中 age 的值为啥一直为 12，在他的代码中找不到任何修改 data 中 age 值的地方。只因为 data 是引用类型数据。在公共函数中为了防止处理引用类型数据时不小心修改了数据，建议先使用 lodash.clonedeep 克隆一下。

// 优化后：
import cloneDeep from "lodash.clonedeep";
const App17 = (props) => {
  const { data } = props || {};
  const dataCopy = cloneDeep(data);
  if (Array.isArray(dataCopy)) {
    dataCopy.forEach((item) => {
      if (item) item.age = 12;
    });
  }
};

/** 九、并发异步执行赋值操作 */
// 优化前：
const App18 = (props) => {
  const { data } = props || {};
  let urlList = [];
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const { id = "" } = item || {};
      getUrl(id).then((res) => {
        if (res) urlList.push(res);
      });
    });
    console.log(urlList);
  }
};

// 上述代码中 console.log(urlList) 是无法打印出 urlList 的最终结果。因为 getUrl 是异步函数，执行完才给 urlList 添加一个值，而 data.forEach 循环是同步执行的，当 data.forEach 执行完成后，getUrl 可能还没执行完成，从而会导致 console.log(urlList) 打印出来的 urlList 不是最终结果。
// 所以我们要使用队列形式让异步函数并发执行，再用 Promise.all 监听所有异步函数执行完毕后，再打印 urlList 的值。

// 优化后：
const App19 = async (props) => {
  const { data } = props || {};
  let urlList = [];
  if (Array.isArray(data)) {
    const jobs = data.map(async (item) => {
      const { id = "" } = item || {};
      const res = await getUrl(id);
      if (res) urlList.push(res);
      return res;
    });
    await Promise.all(jobs);
    console.log(urlList);
  }
};

/** 十、过度防御 */
// 优化前：
const App20 = (props) => {
  const { data } = props || {};
  let infoList = [];
  if (Array.isArray(data)) {
    infoList = data.map((item) => {
      const { name, age } = item || {};
      return `我的名字是${name},今年${age}岁了`;
    });
  }
  const info = infoList?.join("，");
};

// infoList 后面为什么要跟 ?，数组的 map 方法返回的一定是个数组。

// 优化后：
const App21 = (props) => {
  const { data } = props || {};
  let infoList = [];
  if (Array.isArray(data)) {
    infoList = data.map((item) => {
      const { name, age } = item || {};
      return `我的名字是${name},今年${age}岁了`;
    });
  }
  const info = infoList.join("，");
};
