const request = require('../utils/request')

exports.getStat = (params) => {
  return request.post('/api/stat', params);
};