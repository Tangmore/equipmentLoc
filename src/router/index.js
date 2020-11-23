import Vue from 'vue'
import Router from 'vue-router'
// import miniHome from '@/page/miniHome'
// import home from '@/page/home'
import login from '@/page/login'
// PC 
import pcDeviceMap from '@/page/PC/pcDeviceMap' 
import pcDeviceMapUpdate from '@/page/PC/pcDeviceMapUpdate' 

// mini  
import miniMap from '@/page/mini/miniMap'//map 



Vue.use(Router)

var routerList = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  // {
  //   path: '/miniHome',
  //   name: 'miniHome',
  //   component: miniHome
  // },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: home
  // },
  // mini  
  {
    path: '/miniMap', //map
    name: 'miniMap',
    component: miniMap
  }, 
  // {
  //   path: '/miniEnergyManage', //能源管理
  //   name: 'miniEnergyManage',
  //   component: miniEnergyManage
  // }, 
  //PC 
  {
    path: '/pcDeviceMap',
    name: 'pcDeviceMap',
    component: pcDeviceMap
  }, 
  {
    path: '/pcDeviceMapUpdate',
    name: 'pcDeviceMapUpdate',
    component: pcDeviceMapUpdate
  }, 
];
let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
if (flag) {
  console.log('PHONE')
  routerList.push(
    {
      path: '/',
      name: 'miniMap',
      component: miniMap
    },
  )
} else {
  routerList.push(
    {
      path: '/',
      name: 'pcDeviceMap',
      component: pcDeviceMap
    },
  )
}
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: routerList
})
