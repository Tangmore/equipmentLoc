<template>
   <div class="topM">
        <span class="icon iconfont iconfanhui" @click="$router.go(-1);"></span>
        <div class="titleBox">{{pageObj.pageName}}</div>
        <div class="userBox">
          <!-- 设备管理 -->
          <el-dropdown size="mini" @command="mainMenuChange">
            <span class="el-dropdown-link dropBtn">
              <i class="system iconfont iconiconquanbu"></i>
            </span>
            <el-dropdown-menu slot="dropdown" 
            style=" max-height: 200px !important;
            overflow-y: scroll; overflow-x:hidden;">
              <el-dropdown-item
                v-for="(item, index) in systemMenuList"
                :key="index"
                :command="item">
                {{ item.pageName }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 用户管理 -->
          <el-dropdown size="mini" @command="menuChange">
            <span class="el-dropdown-link dropBtn">
              <i class="user iconfont iconyonghu"></i>
            </span>
            <el-dropdown-menu slot="dropdown"
             style=" max-height: 200px !important;
            overflow-y: scroll; overflow-x:hidden;">
              <el-dropdown-item
                v-for="(item, index) in userMenuList"
                :key="index"
                :command="item.path"
              >
                {{ item.pageName }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown> 
        </div>
      </div>
</template>

<script>
export default {
  name: "confirmPopup",
  data() {
    return {
      userMenuList: [
         {pageName:'系统首页', path:'miniHome'},
         {pageName:'用户管理', path:'miniUserManager'},
         {pageName:'运行日志', path:'miniRunLogs'},
         {pageName:'维保信息', path:'mimiMaintenanceLogs'},
         {pageName:'报表查询', path:'miniReports'},
         {pageName:'报警管理', path:'mimiAlarm'},
         {pageName:'退出登录', path:'login'},
      ],
      systemMenuList:[
        {pageName:'暖通空调',url:'miniMap', type:'lengji',icon:'iconkongtiao',info:'5'},
        {pageName:'给排水控制',url:'miniMap', type:'jipaishui',icon:'iconGIS-tulitucengicon_paiqifa',info:0},
        {pageName:'变配电监视',url:'miniMap', type:'bianpeidian',icon:'iconbianpeidian',info:0},
        {pageName:'视频监控',url:'miniMap', type:'jiankong',icon:'iconshipinjiankong',info:0},
        {pageName:'防盗系统',url:'miniMap', type:'fangdao',icon:'iconjingcha',info:'3'},
        {pageName:'门禁管理',url:'miniMap', type:'menjin',icon:'iconmenjinxitong',info:'4'},
        {pageName:'电子巡更',url:'miniMap', type:'dianzixungeng',icon:'icondianzixungeng',info:0},
        {pageName:'消防系统',url:'miniMap', type:'xiaofangxitong',icon:'icongonganxiaofang',info:0},
        {pageName:'公共照明',url:'miniMap', type:'gonggongzhaoming',icon:'icondiandeng-dengpao-zhaoming',info:0},
        {pageName:'夜景照明',url:'miniMap', type:'yejingzhaoming',icon:'iconyedeng',info:0},
        {pageName:'电梯监控',url:'miniMap', type:'diantijiankong',icon:'icondianti',info:'1'},
        {pageName:'客流统计', url:'miniMap',type:'keliutongji',icon:'iconzongkeliuliang',info:'2'},
        {pageName:'停车场管理', url:'miniParkingLot',type:'tingchechang',icon:'icontingchechang',info:0},
        {pageName:'信息发布', url:'miniMap',type:'xinxifabu',icon:'icon5-xinxi',info:0},
        {pageName:'背景音乐', url:'miniMap',type:'beijingyinyue',icon:'iconshengyin',info:0},
        {pageName:'能耗管理',url:'miniEnergyManage', type:'',icon:'iconnengyuan1',info:0},
        {pageName:'设备管理',url:'miniEquipmentManage', type:'',icon:'iconweihu',info:0},
        {pageName:'用户自定义',url:'', type:'',icon:'iconjiahao',info:0},
      ],
    };
  },
  props: { 
    pageObj: { type: Object, default: false }, 
  },
  methods: {
     // 管理员下拉菜单切换
    menuChange(command) {
      this.$router.push("/" + command);
    }, 
     // 主页下拉菜单切换
    mainMenuChange(item) { 
     console.log(item)
     if(item.url){
        if(item.type){
          this.$router.push(`/${item.url}?type=${item.type}`);
        }else{
          this.$router.push(`/${item.url}`);
        } 
        sessionStorage.setItem('systemName',item.pageName);   
     } 
    }, 
  }
};
</script>

<style scoped lang="scss">
 @import "../../../assets/css/mini/topM"; 
</style>
