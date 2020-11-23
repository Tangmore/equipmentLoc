const Mock = require('mockjs');
//格式： Mock.mock( url, post/get , 返回的数据)； 
//子系统
Mock.mock('/systemList', 'get', require('./json/systemList.json'));
//设备列表
Mock.mock('/deviceList', 'get', require('./json/deviceList.json'));
// 使用率 故障 工单
Mock.mock('/statistics/useRateStatistics', 'get', require('./json/useRateStatistics.json'));