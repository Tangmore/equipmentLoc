<template>
  <div class="main">
    <!-- <topMenu></topMenu>
    <navMenu></navMenu> -->
    <div class="container">
      <div class="part">
        <div class="angle1"></div>
        <div class="angle2"></div>
        <div class="angle3"></div>
        <div class="angle4"></div> 
        <div class="drawing">
          <div class="canvas" id="drawing">
            <canvas class="" ref="canvas" id="canvas" style="position:absolute;z-index: 1;"  width="100%" height="100%"></canvas>
          </div>
          <div class="device" id="device">
            <template v-for="(item,index) in deviceList">
              <el-tooltip effect="dark" placement="top-start" :key="index">
                <div slot="content">设备说明：{{item.note}}</div>
                <div class="tag " :class="item.wState == 0 ? 'tagWOffline' : (item.wState == 1 ? 'tagNormal' : 'tagError')"
                     :style="'left:'+item.positionX+'px;top:'+item.positionY+'px;'" @click="getDeviceDetail(item.id,item)">
                  <span class="iconfont" :class="item.typeCode"></span>
                </div>
              </el-tooltip>
            </template>
          </div>
        </div>
      </div>
      <!--弹窗-->
      <transition name="fade">
        <div class="DialogMini" v-show="dialogVisible">
          <div class="carrier">
            <div class="close">
              <div @click="closed">X</div>
            </div>
            <div class="filler">
              <div class="fillter">
                <div class="headLine">
                  <div class="active">{{equipmentName}}</div>
                </div>
                <div class="fillerContent">
                  <div class="detail">
                    <template v-for="(item,index) in equipmentInfo">
                      <div class="tab" :key="index">设备说明：{{item.note}}</div>
                      <div class="tab" :key="index">设备类型：{{item.typeName}}</div>
                      <div class="tab" :key="index">设备状态：
                        <span class="cloorGrey" v-if="item.wState==0">下线</span>
                        <span class="cloorGreen" v-else-if="item.wState==1">正常</span>
                        <span class="cloorRed" v-else-if="item.wState==3">离线</span>
                      </div>
                      <div class="tab" :key="index" v-if="item.Gtemp">供水温度：{{item.Gtemp}}</div>
                      <div class="tab" :key="index" v-if="item.Jtemp">加水温度：{{item.Jtemp}}</div>
                      <div class="tab" :key="index" v-if="item.electricCurrent">电流：{{item.electricCurrent}}</div>
                      <div class="tab" :key="index" v-if="item.Voltage">电压：{{item.Voltage}}</div>
                      <div class="tab" :key="index" v-if="item.personNum">当前客流量：{{item.personNum}}人</div>

                      <div class="tab" :key="index">运行状态：
                        <template v-if="item.state!=2">
                          <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            active-color="rgb(74 114 177)"
                            :value="item.state"
                            @change="item.state==0 ? item.state=1 :item.state=0">
                          </el-switch>
                        </template>
                        <template v-else>
                          <el-switch
                            v-model="value"
                            disabled>
                          </el-switch>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!--弹窗-监控-->
      <transition name="fade">
        <div class="DialogMini" v-show="videoVisible">
          <div class="carrier">
            <div class="close">
              <div @click="closed">X</div>
            </div>
            <div class="filler">
              <div class="fillter">
                <div class="headLine">
                  <div class="active">{{equipmentName}}</div>
                </div>
                <div class="fillerContent"> 
                  <div class="videoCon">
                    <video id="video" autoplay loop muted>
                      <source src="../../assets/img/videoPlane.mp4">
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import topMenu from '../../components/top'
  import navMenu from '../../components/navMenu'
  import axios from '../../axios.js'

  export default {
    name: "pcDeviceMap",
    components: {topMenu, navMenu},
    data() {
      return {
        type:this.$route.query.type || 'iconkongtiao',
        canvas: null,
        context: null,
        imgX: 0,//图片起点X
        imgY: 0,//图片起点Y
        imgWidth: 0,
        imgHeight: 0,
        imgScale: 1,//图片放大比列
        MINIMUM_SCALE: 1,//图片最小缩放比列
        canvasWidth: 0,//画布宽
        canvasHeight: 0,//画布高
        imgSrc: require("../../assets/img/map.png"),
        scaleX: 1,//画布与屏幕的宽的比例，
        scaleY: 1,//画布与屏幕的高的比例，
        dragging: false,//是否缩放
        isWheel: true,//是否滚动鼠标滚轮
        pos: {},//记录鼠标起点位置
        posl: {},//记录鼠标移动位置
        deviceList:[],
        equipmentInfo:[],
        equipmentName:'',
        dialogVisible:false,
        videoVisible:false,
        value:true,

      }
    },
    mounted() {
      //this.global.navIndex=this.type;
      this.canvas = document.getElementById('canvas'); //画布对象canvas
      window.addEventListener('mousewheel', this.mousewheel, false);
      window.addEventListener('mousedown', this.mousedown, false);
      window.addEventListener('mousemove', this.mousemove, false);
      window.addEventListener('mouseup', this.mouseup, false);
    },
    created() {
      this.getList();
    },
    watch: {
      '$route'(to, from) { //监听路由是否变化
        if (to.query.type != from.query.type) {
          this.type = to.query.type;
          this.global.navIndex=this.type;
          this.getList();//重新加载数据
        }
      }
    },
    methods:{
      getList:function(){
        axios.fetchGet('/deviceList').then((data) => {
          let jsonObj=data.data;
          let $this=this;
          let arr=[];
          jsonObj.forEach(item=>{
            if(item.typeCode==this.type){
              arr.push(item)
            }
          })
          this.deviceList=arr;
          this.$nextTick(function () {
            $this.loadImg();
          })
        })
      },
      //canvas配置
      loadImg: function () {
        let $this = this;
        $this.canvasWidth = document.getElementById('drawing').offsetWidth;
        $this.canvasHeight = document.getElementById('drawing').offsetHeight;

        $this.context = $this.canvas.getContext('2d');//画布显示二维图片
        $this.canvas.width = $this.canvasWidth;//设置canvas画布宽
        $this.canvas.height = $this.canvasHeight;//设置canvas画布高
        $this.img = new Image();
        $this.img.onload = function () {
          $this.drawImage();
        };
        this.img.src = this.imgSrc;
      },
      //canvas绘制图片
      drawImage: function () {
        let $this = this;
        this.context.clearRect(0, 0, $this.canvasWidth, $this.canvasHeight);
        // 保证  imgX  在  [img.width*(1-imgScale),0]   区间内
        if ($this.imgX < $this.img.width * (1 - $this.imgScale)) {
          $this.imgX = $this.img.width * (1 - $this.imgScale);
        } else if ($this.imgX > 0) {
          $this.imgX = 0
        }
        // 保证  imgY   在  [img.height*(1-imgScale),0]   区间内
        if ($this.imgY < $this.img.height * (1 - $this.imgScale)) {
          $this.imgY = $this.img.height * (1 - $this.imgScale);
        } else if ($this.imgY > 0) {
          $this.imgY = 0
        }
        $this.imgWidth = $this.canvasWidth * $this.imgScale;
        $this.imgHeight = $this.canvasHeight * $this.imgScale
        this.context.drawImage(
          $this.img, //规定要使用的图像、画布或视频。
          0, 0, //开始剪切的 x 坐标位置。
          $this.img.width, $this.img.height,  //被剪切图像的高度。
          $this.imgX, $this.imgY,//在画布上放置图像的 x 、y坐标位置。
          $this.canvasWidth * $this.imgScale, $this.canvasHeight * $this.imgScale,  //要使用的图像的宽度、高度
        );
        if (this.isWheel) {
          this.locationEiSet();
        } else {
          this.locationEiSet();
        }

      },
      //已定位设备并绘制位置
      locationEiSet: function () {
        if (this.deviceList) {
          this.deviceList.forEach(item => {
            this.$set(item, 'positionX', (item.location.X / 100) * this.imgWidth + this.imgX);
            this.$set(item, 'positionY', (item.location.Y / 100) * this.imgHeight + this.imgY);
          });
        }
      },
      //监听鼠标按下
      mousedown: function (event) {
        this.isWheel = false;
        this.dragging = true;
        this.pos = this.windowToCanvas(event.clientX, event.clientY);  //坐标转换，将窗口坐标转换成canvas的坐标
      },
      //监听鼠标移动
      mousemove: function (event) {
        let $this = this;
        if ($this.dragging && this.imgScale > 1) {
          $this.posl = $this.windowToCanvas(event.clientX, event.clientY);
          let x = $this.posl.x - $this.pos.x, y = $this.posl.y - $this.pos.y;
          $this.imgX += x;
          $this.imgY += y;
          $this.pos = JSON.parse(JSON.stringify($this.posl));
          $this.drawImage();  //重新绘制图片
        }
      },
      //监听鼠标松开
      mouseup: function (event) {
        this.dragging = false;
        this.isWheel = false;
      },
      //鼠标滚动事件
      mousewheel(event) {
        if (event.target.id == 'device') {
          let $this = this;
          this.isWheel = true;
          if (!$this.buildingVisible && !$this.equipmentVisible && !$this.householdVisible && !$this.isSelectVi && !$this.equipmentListVisible
            && !$this.entrancVisible && !this.inspectionVisible && !$this.configureRoomVisible && !$this.gnfeVisible && !this.parkingVisible && !this.meterVisible
            && !this.trashVisible && !this.trashVisible) {
            let pos = $this.windowToCanvas(event.clientX, event.clientY);
            let wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40));
            let newPos = {
              x: ((pos.x - $this.imgX) / $this.imgScale).toFixed(2),
              y: ((pos.y - $this.imgY) / $this.imgScale).toFixed(2)
            };
            if (wheelDelta > 0) {// 放大
              $this.imgScale += 0.1;
              if ($this.imgScale > 1 && $this.imgScale < 1.2) {
                $this.imgScale = 1.2;
              } else if ($this.imgScale > 1.2 && $this.imgScale < 1.5) {
                $this.imgScale = 1.5;
              } else if ($this.imgScale > 1.5 && $this.imgScale < 1.7) {
                $this.imgScale = 1.7;
              } else if ($this.imgScale > 1.7 && $this.imgScale < 2) {
                $this.imgScale = 2;
              } else if ($this.imgScale > 2) {
                $this.imgScale = 2;
                $this.isWheel = false;
              }
              $this.imgX = (1 - $this.imgScale) * newPos.x + (pos.x - newPos.x);
              $this.imgY = (1 - $this.imgScale) * newPos.y + (pos.y - newPos.y);
            } else {//  缩小
              $this.imgScale -= 0.1;
              if ($this.imgScale > 1 && $this.imgScale < 1.2) {
                $this.imgScale = 1;
              } else if ($this.imgScale > 1.2 && $this.imgScale < 1.5) {
                $this.imgScale = 1.2
              } else if ($this.imgScale > 1.5 && $this.imgScale < 1.7) {
                $this.imgScale = 1.5;
              } else if ($this.imgScale > 1.7 && $this.imgScale < 2.0) {
                $this.imgScale = 1.7;
              } else if ($this.imgScale < 1) {
                $this.imgScale = 1;
                $this.isWheel = false;
              }
              $this.imgX = (1 - $this.imgScale) * newPos.x + (pos.x - newPos.x);
              $this.imgY = (1 - $this.imgScale) * newPos.y + (pos.y - newPos.y);
            }
            $this.drawImage();
            setTimeout(function () {
              this.isWheel = false;
            }, 2000)
          }
        }
      },
      //转换坐标
      windowToCanvas: function (x, y) {
        let box = this.canvas.getBoundingClientRect();  //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
        return {
          x: x - box.left - (box.width - canvas.width) / 2,
          y: y - box.top - (box.height - canvas.height) / 2
        };
      },
      //获取设备详情
      getDeviceDetail:function(id,item){
        if(item.typeCode=='iconshipinjiankong'){
          this.videoVisible=true;
          return
        }
        if(item.typeCode=='icon5-xinxi'){
          this.videoVisible=true;
          return
        }
        this.dialogVisible=true;
        let arr=[];
        this.deviceList.forEach(item=>{
          if(item.id==id){
            this.equipmentName=item.name
            arr.push(item)
          }
        })
        this.equipmentInfo=arr;
      },
      //关闭弹窗
      closed:function () {
        this.dialogVisible=false;
        this.videoVisible=false;
      },
      changeType:function (type) {
        this.type=type;
        this.getList();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/PC/pcAirConditioner";
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-leave-to {
    display: none;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  .transition {
    opacity: 1;
    transform: scale(1);
  }

  .transition-to {
    opacity: 0;
    transform: scale(0.2);
  }

  .transition-active, .transition-active {
    transition: all 0.5s ease;
  }

  .enter {
    opacity: 0;
    transform: translateX(100%);
  }

  .leave-to {
    opacity: 0;
    transform: translateX(-100%);
    // 解决页面从上往下位移问题
    position: absolute;
  }

  .enter-active, .leave-active {
    transition: all 0.35s ease;
  }
</style>
