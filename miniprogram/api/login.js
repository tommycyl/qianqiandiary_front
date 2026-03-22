// api/login.js
const request = require('../utils/request');

/**
 * 用户名密码登录
 * @param {Object} params {username, password}
 * @returns {Promise}
 */
exports.login = (params) => {
  return request.post('/api/login', params);
};

/**
 * 获取用户信息（登录后调用）
 * @returns {Promise}
 */
exports.getUserInfo = (id) => {
  return request.get('/api/${id}');
};

exports.wxlogin = (params) => {
  return request.post('/api/wxlogin',params);
};