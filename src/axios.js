import axios from 'axios'
import qs from 'qs'
import {getCookie} from './utils'
import { Message, Loading } from 'element-ui';
import router from './router'
import globalVariable from './global_variable'
import Vue from 'vue'


let loading;      //定义loading变量
function startLoading() {    //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading() {    //使用Element loading-close 方法
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
axios.defaults.timeout=10000;
axios.defaults.baseURL=globalVariable.baseURL;
axios.defaults.headers['Access-Control-Allow-Methods']="PUT,POST,GET,DELETE,OPTIONS";


//request 拦截器
axios.interceptors.request.use(
  config =>{
    if(config.method=='post'){
      config.data = qs.stringify(config.data);
    }
    //config.data = JSON.stringify(config.data);
    const tokens= getCookie('session');
    const token= localStorage.getItem('token');
    config.headers={
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
    };
    if (token =='请登录') {
      delete axios.defaults.headers.common['Authorization'];
    }else{
    }
    if(globalVariable.interceptors==true){
      showFullScreenLoading();
    }
    return config;
  },
  (error) =>{
    console.log('错误的传参');
    return Promise.reject(error);
  }
);
//response 拦截器
window.tipLock = false;
axios.interceptors.response.use(
  response =>{
    tryHideFullScreenLoading();
    if(response.data.login==1){
      if(!window.tipLock){
        window.tipLock = true;
        Vue.prototype.$alert('登录过期请重新登录？', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            router.push({path: '/'});
            window.tipLock = false; //这句如果是第三方的alert 则写在回调中
          }
        });
      }


    }else{
      return response;
    }

  },
  (error) =>{
    if (error.response) {
      switch (error.response.status) {
        case 302:
          //跳转登录
          //this.$store.dispatch(logout);

      }
    }
    tryHideFullScreenLoading();
    console.log('错误的传参');
    return Promise.reject(error.response.data);
  }
);
//发送post请求
export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {

        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
//发送get请求
export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: param})
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export default {
  fetchPost,
  fetchGet,
}
