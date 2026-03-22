const request = require('../utils/request');

exports.getAllDays = (params) => {
  return request.post('/api/getAllDays', params);
};

exports.getDiary = (id) =>{
  return request.get('/api/getDiary/${id}');
};

exports.getOnedayDiary = (params) =>{
  return request.post('/api/getOnedayDiary',params)
}

exports.addDiary = (params) =>{
  return request.post('/api/addDiary',params)
};

exports.deleteDiary = (params) =>{
  return request.post('/api/deleteDiary',params)
};

exports.updateDiary = (params) =>{
  return request.post('/api/updateDiary',params)
}
