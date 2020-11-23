<template>
  <div class="mainHome">
    <div class="bgi"></div>
    <!--主体-->
    <div class="content" ref="container">
      <div class="topM">
        <div class="titleBox">
          <img src="../assets/img/inspection.png">
         <div class="title">智慧小区</div>
        </div>
        <div class="userBox"> 
            <el-dropdown @command='menuChange'>
              <span class="el-dropdown-link dropBtn"> 
                <i class="user iconfont iconyonghu"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in userMenuList" :key="index" :command='item.path'> {{item.pageName}}</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div> 
      <div class="menu">
         <div class="items">
            <div class="item" v-for="(item,index) in systemMenuList" :key="index" @click="routerTo(item)">
              <div class="iconBox"> 
                  <i class="iconfont spe" v-if="item.pageName=='用户自定义'" :class="item.icon">
                    <span v-if="item.info" class="badge">{{item.info}}</span>
                  </i> 
                  <i class="iconfont" v-else :class="item.icon">
                    <span v-if="item.info" class="badge">{{item.info}}</span>
                  </i> 
              </div>
              <p class="name over-text">{{item.pageName}}</p>
            </div> 
         </div>
      </div>
    </div>
  </div>
</template>
 <script>   
export default {
  name: "miniHome",
  data() { 
    return{
      isadvanced:false, 
      userMenuList:[
         {pageName:'系统首页', path:'miniHome'}, 
         {pageName:'退出登录', path:'login'},
      ],
      systemMenuList:[ 
        {pageName:'视频监控',url:'miniMap', type:'jiankong',icon:'iconshipinjiankong',info:0},
        {pageName:'门禁管理',url:'miniMap', type:'menjin',icon:'iconmenjinxitong',info:'4'},
        {pageName:'电梯监控',url:'miniMap', type:'diantijiankong',icon:'icondianti',info:'1'},
        {pageName:'停车场管理', url:'',type:'tingchechang',icon:'icontingchechang',info:0},
        {pageName:'设备管理',url:'', type:'',icon:'iconweihu',info:0},
        {pageName:'用户自定义',url:'', type:'userSelf',icon:'iconjiahao',info:0},
      ],
       
    }
  },  
  methods: {
    // 管理员下拉菜单切换
    menuChange(command) { 
      this.$router.push('/' + command); 
    },
    // 页面
    routerTo(item){
      if(item.url){
        if(item.type){
          this.$router.push(`/${item.url}?type=${item.type}`);
        }else{
          this.$router.push(`/${item.url}`);
        } 
        sessionStorage.setItem('systemName',item.pageName); 
      } 
    }
  }
};
</script>

<style scoped lang="scss"> 
  @import "../assets/css/mini/miniHome";  
</style>
