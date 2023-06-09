/*
 * @Author: QINJIN
 * @Date: 2023-06-02 16:48:14
 * @LastEditTime: 2023-06-02 17:08:24
 * @LastEditors: QINJIN
 * @Description: Do not edit
 * @FilePath: /tips/取得文件扩展名.js
 */

// 问题 1: 怎样取得文件扩展名?
var file1 = "50.xsl";
var file2 = "30.doc";
getFileExtension(file1); //returs xsl
getFileExtension(file2); //returs doc

function getFileExtension(filename) {
  /*TODO*/
}

// 解决方法 1: 正则表达式
function getFileExtension1(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}

// 解决方法 2: String的split方法
function getFileExtension2(filename) {
  return filename.split(".").pop();
}
/* 这两种解决方法不能解决一些边缘情况，这有另一个更加强大的解决方法。 */

// 解决方法 3: String的slice、lastIndexOf方法
function getFileExtension3(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

console.log(getFileExtension3("")); // ''
console.log(getFileExtension3("filename")); // ''
console.log(getFileExtension3("filename.txt")); // 'txt'
console.log(getFileExtension3(".hiddenfile")); // ''
console.log(getFileExtension3("filename.with.many.dots.ext")); // 'ext'

/* 这是如何实现的呢?

String.lastIndexOf() 方法返回指定值（本例中的'.'）在调用该方法的字符串中最后出现的位置，如果没找到则返回 -1。
对于'filename'和'.hiddenfile'，lastIndexOf的返回值分别为0和-1无符号右移操作符(>>>) 将-1转换为4294967295，将-2转换为4294967294，这个方法可以保证边缘情况时文件名不变。
String.prototype.slice() 从上面计算的索引处提取文件的扩展名。如果索引比文件名的长度大，结果为""。
对比
解决方法	                                         参数	                              结果
                                                  ’‘                              undefined
                                                ‘filename’                        undefined
解决方法 1: Regular Expression                  ‘filename.txt’                       ‘txt’
                                                ‘.hiddenfile’                    ‘hiddenfile’
                                        ‘filename.with.many.dots.ext’               ‘ext’
                                                  ’‘                                  ’‘
                                                ‘filename’                        ‘filename’
解决方法 2: String split                         ‘filename.txt’                       ‘txt’
                                                ‘.hiddenfile’                     ‘hiddenfile’
                                        ‘filename.with.many.dots.ext’               ‘ext’      
                                                  ’‘                                  ’‘
                                                ‘filename’                            ’‘
解决方法 3: String slice, lastIndexOf            ‘filename.txt’                       ‘txt’
                                                ‘.hiddenfile’                         ’‘
                                        ‘filename.with.many.dots.ext’                ‘ext’

实例与性能
这里 是上面解决方法的实例。

这里 是上面三种解决方法的性能测试。 */
