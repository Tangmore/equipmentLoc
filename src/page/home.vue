<template>
  <div class="main">
    <!-- <topMenu></topMenu> -->
    <!-- <navMenu></navMenu> -->
    <div class="container">
       content
    </div>
  </div>
</template>
<script>
  import topMenu from '../components/top'
  import navMenu from '../components/navMenu'
  import axios from '../axios.js'
  export default {
    name: "home",
    components: {topMenu,navMenu},
    data(){
      return{

      }
    },
    created() {
    },
    mounted() {
      this.global.topIndex=0;
    },
    beforeDestroy() {
    },
    destroyed() {
    },
    methods: {

    }
  };
</script>

<style scoped lang="scss">
  @import "../assets/css/PC/home";
</style>
