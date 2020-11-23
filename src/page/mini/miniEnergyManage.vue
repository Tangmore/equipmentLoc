<template>
  <div class="main">
    <topM :pageObj="pageObj"></topM> 
    <div class="content" ref="content"> 
      <div class="energyCharts"> 
        <div class="search">
          <div class="item">
            <!-- <span>分类选择：</span> -->
            <div class="condition">
              <el-radio v-model="checkedEn" label="水" border @change="changeEnType('水')">水</el-radio>
              <el-radio v-model="checkedEn" label="电" border @change="changeEnType('电')">电</el-radio>
            </div>
          </div>
          <div class="item">
            <!-- <span>时间范围：</span> -->
            <div class="condition">
              <el-radio v-model="checkedTime" label="年" border @change="changeTimes('年')">年</el-radio>
              <el-radio v-model="checkedTime" label="月" border @change="changeTimes('月')">月</el-radio>
              <el-radio v-model="checkedTime" label="日" border @change="changeTimes('日')">日</el-radio>
            </div>
          </div>
          <div class="item">
            <!-- <span>设备类型：</span> -->
            <div class="condition">
              <template v-for="(item,index) in deviceTypeList">
                <div class="radio" @click="changeType(index,item)" :key="index" :class="{'active' :checkIndex==index}">
                  <div :class="item.type"></div>
                  {{item.name}}
                </div>
              </template>
            </div>
          </div>
        </div> 
        <div style="width: 100%;height: calc(100% - 150px);display: flex" id="utilization">
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
  import axios from "../../axios.js";
  import HighCharts from 'highcharts'
  import topM from "./components/topM.vue";
  export default {
    name: "miniEnergyManage",
    components: {
        topM
    },
    data() {
      return {
        // 系统title信息 
        pageObj: {pageName: sessionStorage.getItem('systemName'),page:'map'}, 

        tabChecked: 0,
        horizontalScreen:false,
        nowDate: "",    // 当前日期
        nowTime: "",    // 当前时间
        nowWeek: "" ,    // 当前星期

        checkedEn: '水',//选中的能源类型
        checkedTime: '月',//选中的时间
        checkedType: '',//选中设备的类型
        chartsName: '年度用水统计',
        lists: [],
        chart: null,
        checkIndex: 0,
        deviceType: [
          {
            id: '001',
            name: '全部',
            type: 'all',
            isWater: true,
            isElectricity: true,
          },
          {
            id: '002',
            name: '空调',
            type: 'kongtiao',
            isWater: false,
            isElectricity: true,
          },
          {
            id: '003',
            name: '冷机',
            type: 'lengji',
            isWater: false,
            isElectricity: true,
          },
          {
            id: '001',
            name: '照明',
            type: 'zhaoming',
            isWater: false,
            isElectricity: true,
          },
          {
            id: '001',
            name: '水泵',
            type: 'shuibeng',
            isWater: true,
            isElectricity: true,
          },
          {
            id: '001',
            name: '电梯',
            type: 'dianti',
            isWater: false,
            isElectricity: true,
          },
          {
            id: '001',
            name: '门禁',
            type: 'menjin',
            isWater: false,
            isElectricity: true,
          },
          {
            id: '001',
            name: '监控',
            type: 'jiankong',
            isWater: false,
            isElectricity: true,
          },
          {
            id: '001',
            name: '显示屏',
            type: '显示屏',
            isWater: false,
            isElectricity: true,
          },
          {
            id: '001',
            name: '水表',
            type: 'shuibiao',
            isWater: true,
            isElectricity: true,
          }
        ],
        deviceTypeList: [],
        sysName: ['冷机', '空调', '照明', '水泵', '电梯', '门禁', '监控', '显示屏', '水表'],
        annualWater: [
          {name: '水表', y: 135},
          {name: '水泵', y: 123},
        ],//年度总用水
        annualElectricity: [
          {name: '冷机', y: 135},
          {name: '空调', y: 832},
          {name: '照明', y: 542},
          {name: '水泵', y: 123},
          {name: '电梯', y: 321},
          {name: '门禁', y: 157},
          {name: '监控', y: 356},
          {name: '显示屏', y: 201},
        ],//年度总用电
        randomList:[],//随机生成的*设备月（日）用水（电）
      };
    },
    created(){  
      this.$nextTick(() => {  
        this.initMonth();    
        this.changeEnType('水');   
      }) 
    },
    mounted() {
      let $this = this;
      window.addEventListener("resize", this.renderResize, false);
    
    },
    destroyed() {
      window.removeEventListener("resize", this.renderResize, false)
    },
    methods: { 
      // 监听浏览器横竖屏
      renderResize(){
        let $this = this;
        $this.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//屏幕可视高度
        $this.w = document.documentElement.clientWidth;//屏幕可视宽度
        this.$refs.content.style.height = this.h-50 + 'px';
        if(this.w>this.h){
            console.log('横屏');
            this.horizontalScreen=true;
        }else{
            console.log('竖屏');
            this.horizontalScreen=false;
        }
      }, 
       //年度用水(电)
      initAll: function () {
        let data = [];
        if (this.checkedEn == '水' && this.checkedTime == '年') {
          data = this.annualWater;
        } else if (this.checkedEn == '电' && this.checkedTime == '年') {
          data = this.annualElectricity;
        }
        this.chart = HighCharts.chart('utilization', {
          colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
            '#f15c80', '#e4d354', '#2b908f', '#91e8e1'],
          credits: {
            enabled: false // 禁用版权信息
          },
          chart: {
            type: 'pie',
            backgroundColor: 'none',
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
            }
          },
          title: {
            text: null,
            style: {
              color: '#ffffff',
              fontSize: "14px"

            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                enabled: true,
                format: '{point.name}'
              }
            }
          },
          series: [{
            type: 'pie',
            name: null,
            data: data
          }]
        });
      },

      initMonth: function () {
        let color='';
        if(this.checkedType=='冷机'){
          color='#7cb5ec'
        }else if(this.checkedType=='空调'){
          color='#434348'
        }else if(this.checkedType=='照明'){
          color='#90ed7d'
        }else if(this.checkedType=='水泵'){
          color='#f7a35c'
        }else if(this.checkedType=='电梯'){
          color='#8085e9'
        }else if(this.checkedType=='门禁'){
          color='#f15c80'
        }else if(this.checkedType=='监控'){
          color='#e4d354'
        }else if(this.checkedType=='显示屏'){
          color='#2b908f'
        }else if(this.checkedType=='水表'){
          color='#91e8e1'
        }else{
          color='#b72049'
        }
        this.randomList = this.random(12);
        this.chart = new HighCharts.Chart({
          credits: {
            enabled: false // 禁用版权信息
          },
          chart: {
            renderTo: 'utilization',
            type: 'column',
            backgroundColor: 'none',
            options3d: {
              enabled: true,
              alpha: 0,
              beta: 0,
              depth: 20,
              viewDistance: 35
            },
          },
          title: {
            text: null,
            style: {
              color: '#ffffff',
              fontSize: "14px"
            }
          },
            legend: {
            enabled: false
          },
          plotOptions: {
            column: {
              depth: 25,
            }
          },
          xAxis: {
            title: {
              text: '',
              style: {
                color: '#ffffff'
              }
            },
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            labels: {
              style: {
                color: '#ffffff'
              }
            }
          },
          yAxis: {
            title: {
              text: '',
              style: {
                color: '#ffffff'
              }
            },
            labels: {
              style: {
                color: '#ffffff'
              }
            }
          },
          series: [{
            name: null,
            data: this.randomList,
            color: color,
          }]
        });
      },

      initDay: function () {
        let color='';
        if(this.checkedType=='冷机'){
          color='#7cb5ec'
        }else if(this.checkedType=='空调'){
          color='#434348'
        }else if(this.checkedType=='照明'){
          color='#90ed7d'
        }else if(this.checkedType=='水泵'){
          color='#f7a35c'
        }else if(this.checkedType=='电梯'){
          color='#8085e9'
        }else if(this.checkedType=='门禁'){
          color='#f15c80'
        }else if(this.checkedType=='监控'){
          color='#e4d354'
        }else if(this.checkedType=='显示屏'){
          color='#2b908f'
        }else if(this.checkedType=='水表'){
          color='#91e8e1'
        }else{
          color='#b72049'
        }
        this.randomList = this.random(31);
        this.chart = new HighCharts.Chart({
          credits: {
            enabled: false // 禁用版权信息
          },
          chart: {
            renderTo: 'utilization',
            type: 'cylinder',
            backgroundColor: 'none',
            options3d: {
              enabled: true,
              alpha: 0,
              beta: 0,
              depth: 20,
              viewDistance: 35
            },
          },
          title: {
            text: null,
            // style: {
            //   color: '#ffffff',
            //   fontSize: "14px"
            // }
          },
            legend: {
            enabled: false
          },
          plotOptions: {
            column: {
              depth: 25,
            }
          },
          xAxis: {
            title: {
              text: '',
              style: {
                color: '#ffffff'
              }
            },
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            labels: {
              style: {
                color: '#ffffff'
              },
              step:3
            }, 
          },
          yAxis: {
            title: {
              text: '',
              style: {
                color: '#ffffff'
              }
            },
            labels: {
              style: {
                color: '#ffffff'
              }
            }
          },
          series: [{
            name: null,
            data: this.randomList,
            color: color,
          }]
        });
      },

      //切换水电
      changeEnType: function (ele) {
        let arr = [];
        this.deviceType.forEach(item => {
          if (ele == '水') {
            if (item.isWater) {
              arr.push(item)
            }
          } else if (ele == '电') {
            if (item.isElectricity) {
              arr.push(item)
            }
          }
        })
        this.chartsName = this.checkedType + this.checkedTime + '用' + this.checkedEn + '统计'
        this.deviceTypeList = arr;
        if (this.checkedTime == '年') {
          this.initAll();
        } else if (this.checkedTime == '月') {
          this.initMonth();
        } else if (this.checkedTime == '日') {
          this.initDay();
        }
      },

      //切换年月日
      changeTimes: function (ele) {
        this.chartsName = this.checkedType + this.checkedTime + '用' + this.checkedEn + '统计'
        if (ele == '年') {
          this.initAll();
        } else if (ele == '月') {
          this.initMonth();
        } else if (ele == '日') {
          this.initDay();
        }
      },

      //切换设备类型
      changeType: function (index, item) {
        this.checkedType = item.name;
        this.checkIndex = index;
        this.chartsName = this.checkedType + this.checkedTime + '用' + this.checkedEn + '统计';
        if (this.checkedTime == '年') {
          this.initAll();
        } else if (this.checkedTime == '月') {
          this.initMonth();
        } else if (this.checkedTime == '日') {
          this.initDay();
        }

      },
      //生成10个1-100不重复的随机数
      random: function (number) {
        let arr = [];
        while (arr.length < number) {   //原数组长度为0，每次成功添加一个元素后长度加1，当数组添加最后一个数字之前长度为number即可
          let num = Math.floor(Math.random() * 100);   //生成一个0-300的随机整数
          if (arr.length === 0) {   //如果数组长度为0则直接添加到arr数组
            arr.push(num);
          } else {
            for (let i = 0; i < arr.length; i++) {   //当新生成的数字与数组中的元素不重合时则添加到arr数组
              if (arr.join(',').indexOf(num) < 0) {
                arr.push(num);
              }
            }
          }
        }

        return arr;
      }, 
    }
  };

</script>

<style scoped lang="scss">
   @import "../../assets/css/mini/zoomBox";  
   @import "../../assets/css/mini/chartsReset";  
</style>
