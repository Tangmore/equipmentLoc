<template>
  <div class="navMenu">
    <el-scrollbar style="height: 100%"> 
      <template v-for="(item,index) in menus">
        <div :key="index" class="li" @click="changeMenu(index,item.typeCode)" :class="{'active' :type==item.typeCode}"> 
          <i class="iconfont" :class="item.typeCode"></i> 
          <span>{{item.name}}</span>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>
<script>
  export default {
    name: 'navMenu',
    data() {
      return{
        type:'',
        menus:[ 
          // {
          //   id:'001',
          //   name:'视频监控',
          //   typeCode:'iconshipinjiankong'
          // },  
        ]
      }
    },
    mounted() {

    },
    created() {
    },
    methods: {
      changeMenu:function (index,typeCode) { 
        this.type=typeCode; 
        this.$router.push({
          path: '/pcDeviceMap',
          query: {
            type: typeCode,
          }
        })
      }
    },

  }
</script>

<style scoped lang="scss">
  @import "../assets/css/PC/reset";
</style>
