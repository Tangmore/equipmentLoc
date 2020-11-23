// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import './assets/font/iconfont.css'
import Vue from 'vue'
import App from './App'
import router from './router'
// mock
//require('./mock');
require('./mock/mock'); //引入mock数据
// axios
import axios from 'axios';
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;

Vue.use(ElementUI);//使用elementUI

import QS from 'qs'
Vue.prototype.qs = QS;

import HighCharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more';
import highcharts3d from 'highcharts/highcharts-3d'
import cylinder from "highcharts/modules/cylinder";
highcharts3d(HighCharts)
highchartsMore(HighCharts);
cylinder(HighCharts);


Vue.config.productionTip = false;

import globalVariable from './global_variable'
Vue.prototype.global = globalVariable;

// import vConsole from 'vconsole'
// Vue.prototype.vConsole= new vConsole();
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  data() {
    return {
      canvasColor: ['#6ce9ff', '#7ecef4', '#3abfff', '#009afc', '#588aff', '#5b52bf', '#7456ff', '#a537f6', '#ffa337', '#fff771', '#13ab6d',
        '#42df9f', '#49e3d6'],
      token: '',
      isiPad: false,
    }
  },
  mounted() {},

})
