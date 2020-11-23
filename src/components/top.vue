<template>
  <div class="topMenu"> 
    <div class="company">
      <h3>智慧小区</h3>
      <p>ZHIHUIXIAOQU</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "top",
    data() {
      return {
       topMenuList:[],
       active:'',
      } 
    },
    mounted() {
      this.active=this.global.topIndex
    },
    created(){

    },
    methods: {
      changeTop:function (index,path) {
        this.global.topIndex=index;
        this.active=this.global.topIndex;
        this.$router.push({
          path:path,
          /*query:{
            typeId:typeId,
            name:item.name
          }*/
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/PC/reset";
</style>
