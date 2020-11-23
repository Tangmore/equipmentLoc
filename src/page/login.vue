<template>
  <div class="login">  
    <el-row>
      <el-col :xs="2" :sm="8" :md="10" :lg="10" :xl="10">&nbsp;</el-col>
      <el-col :xs="20" :sm="8" :md="4" :lg="4" :xl="4">
      <div class="con">
        <div class="logo">
          <img src="../assets/img/logo.png">
          <p>·智慧小区·</p>
        </div>
        <div class="login-box"> 
          <div class="input"> 
            <input type="text" v-model="username" placeholder="请输入用户名"/>
          </div>
          <div class="input"> 
            <input type="password" v-model="password" placeholder="密码"/>
          </div> 
          <div class="but" @click="login">登录</div>
        </div>
      </div>
      </el-col>
      <el-col :xs="2" :sm="8" :md="10" :lg="10" :xl="10">&nbsp;</el-col> 
    </el-row>
  </div>
</template>

<script> 
  export default {
    name: "login",
    data(){
      return{
        username:'admin',
        password:'123456q',
        code:'',
        imgSrc:'',
        isFullScreen:false,
      }
    },

    mounted () {
      window.callJsFunction = this.callJsFunction;
      // 监听 resize 方法
      //window.addEventListener("resize", this.renderResize, false);
      let el = document.documentElement;
      let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      this.isFullScreen=true;
      if(typeof rfs != "undefined" && rfs) {
        rfs.call(el);
      };
    },
    beforeRouteLeave(to, from, next) {
      //如果跳转的下一页，不是协议页，则删除缓存
      if(to.name === 'equipments') {
        to.meta.keepAlive = false
      }
      next();
    },  
    methods: { 
      //登录
      login: function () {
        // let data = {username: this.username, password: this.$md5(this.password), code: this.code};
        // let $this = this; 

        this.$router.push({path: '/'});
      },
      renderResize() {
        // 判断横竖屏
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        if(width > height) {

        }
      }, 
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/login";
</style>
