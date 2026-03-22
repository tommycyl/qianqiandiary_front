const request = require('../utils/request');

exports.addVirtue = (params) => {
  return request.post('/api/addVirtue', params);
};

exports.getVirtue = (params) => {
  return request.post('/api/getVirtue', params);
};

exports.updateVirtue = (params) => {
  return request.post('/api/updateVirtue', params);
};

exports.getVirtueStat = (params) => {
  return request.post('/api/getVirtueStat', params);
};

