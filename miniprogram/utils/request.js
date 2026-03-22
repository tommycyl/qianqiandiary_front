// 请求封装好了，直接返回的res就是返回体里面data
// 1. 配置基础域名（区分开发/生产环境）
const baseUrl = "https://jpxojesfbhbz.ap-southeast-1.clawcloudrun.com"
// const baseUrl = "http://localhost:8443"
/**
 * 通用请求封装
 * @param {String} url 接口路径（无需加域名）
 * @param {Object} options 请求配置（method/data/header等）
 * @returns {Promise} 返回Promise
 */ 
const request = (url, options = {}) => {
  // 默认配置
  const defaultOptions = {
    method: options.method || 'GET', // 默认GET
    data: options.data || {}, // 默认空参数
    header: {
      'Content-Type': 'application/json', // 默认JSON格式
      'Authorization': wx.getStorageSync('token') || '' // 自动携带Token
    },
    timeout: 10000 // 超时时间10秒
  };

  // 合并自定义配置（如自定义header）
  const finalOptions = { ...defaultOptions, ...options };
  finalOptions.header = { ...defaultOptions.header, ...options.header };

  // 拼接完整接口地址
  finalOptions.url = baseUrl + url;

  return new Promise((resolve, reject) => {
    // 可选：显示加载中（可通过options控制是否显示）
    if (options.showLoading !== false) {
      wx.showLoading({ title: '加载中...', mask: true });
    }

    wx.request({
      ...finalOptions,
      // 请求成功
      success(res) {
        const { code, data, msg } = res.data;
        // 统一处理后端返回码
        if (code === 200) {
          resolve(data); // 成功：只返回核心数据
        } else if (code === 401) {
          // Token过期：跳转登录页
          wx.showToast({ title: '登录已过期', icon: 'none' });
          wx.redirectTo({ url: '/pages/login/login' });
          reject(msg);
        } else {
          // 其他业务错误
          wx.showToast({ title: msg || '请求失败', icon: 'none' });
          reject(msg);
        }
      },
      // 请求失败（网络/超时）
      fail(err) {
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
        reject(err);
      },
      // 请求完成（无论成败）
      complete() {
        // 关闭加载中
        if (options.showLoading !== false) {
          wx.hideLoading();
        }
      }
    });
  });
};

// 简化GET/POST调用（语法糖）
request.get = (url, data, options = {}) => {
  return request(url, { ...options, method: 'GET', data });
};

request.post = (url, data, options = {}) => {
  return request(url, { ...options, method: 'POST', data });
};

// 导出封装的请求函数
module.exports = request;