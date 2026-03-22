const request = require('../utils/request');

exports.addVision = (params) => {
  return request.post('/api/addvision', params);
};

exports.getVision = (params) => {
  return request.post('/api/getvision', params);
};