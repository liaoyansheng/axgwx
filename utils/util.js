//  获取当前年
const formatDate1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return [year].map(formatNumber)
}
//  获取当前月
const formatDate2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return [month].map(formatNumber)
}


//  获取当前时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 将阿拉伯数字转换成汉字
const convertNumber= number => ['零','一','二','三','四','五'][number];

module.exports = {
  formatTime: formatTime,
  formatDate1: formatDate1,
  formatDate2: formatDate2,
  convertNumber
}


// 获取当前页面路径url
function getCurrentPageUrl() {
  var pages = getCurrentPages();    //获取加载的页面
  var currentPage = pages[pages.length - 1];  //获取当前页面的对象
  var url = currentPage.route ;   //当前页面url
  return url;
}

// 获取当前页面路径 url 参数
function getCurrentPageUrlOptions() {
  var pages = getCurrentPages();    //获取加载的页面
  var currentPage = pages[pages.length - 1];    //获取当前页面的对象
  var options = currentPage.options;
  return options;
}