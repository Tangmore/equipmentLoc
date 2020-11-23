<template>
  <div class="main">
    <!--主体-->
    <div class="content" ref="container">
      <topM :pageObj="pageObj"></topM>
      <div class="map"
        @touchstart="touchstart($event)"
        @touchmove="touchmove($event)"
        @touchend="touchend($event)"
        id="map">
            <div class="bgm">
            <!--地图-->
                <div class="plan">
                <div class="canvas" id="drawing">
                    <canvas class="" ref="canvas" id="canvas"></canvas>
                </div>
                <div class="devices" :style="'width:'+imgWidth+'px;height:'+imgHeight+'px'">
                <!--已定位-->
                <div v-for="(item,res) in deviceList" :key="res">
                      <template>
                        <div class="tag colorGray" v-if="item.wState==0"
                                :style="'left:'+item.positionX+'px;top:'+item.positionY+'px;color:#0099ff'"
                                @click="getEquipmentAlarm(item.eiid,item)">
                                <i class="iconfont" :class="item.typeCode" style="color:#fff;"></i>
                        </div>
                        <div class="tag tagNormal" v-if="item.wState==1"
                                :style="'left:'+item.positionX+'px;top:'+item.positionY+'px;color:#0099ff'"
                                @click="getEquipmentAlarm(item.eiid,item)">
                                <i class="iconfont" :class="item.typeCode" style="color:#fff;"></i>
                        </div>
                        <div class="tag tagError" v-else
                                :style="'left:'+item.positionX+'px;top:'+item.positionY+'px;color:#0099ff'"
                                @click="getEquipmentAlarm(item.eiid,item)">
                                <i class="iconfont" :class="item.typeCode" style="color:#fff;"></i>
                        </div>
                      </template>
                </div>
                </div>
                <div class="zoomBox"> 
                    <!-- 视图缩放 -->
                    <div class="zoom zoomUp" @click="changeZoom('up')">
                        <i class="iconfont iconjiahao"></i>
                    </div>
                    <div class="zoom zoomDown" @click="changeZoom('down')">
                        <i class="heng"></i>
                    </div>
                </div>
                </div>
            </div>
      </div>
    </div>

     <!--视频监控  -->
    <transition name="fade">
      <div v-show="videoVisible" class="videoDialog">
        <div class="con" ref="videoDialog">
          <div class="headline">
            <div class="head">{{equipmentName}}</div>
            <i @click="videoVisible=false" class="close iconfont iconicon_close"></i>
          </div>
          <div class="video">
            <div class="cont">
              <video id="video" autoplay loop muted>
                  <source src="../../assets/img/videoPlane.mp4">
              </video>
            </div>
          </div>
        </div>
      </div>
    </transition> 
    <!--详情 -->
    <transition name="fade">
      <div v-show="visibleDialog" class="detailDialog">
        <div class="con" ref="visibleDialog">
          <div class="headline">
            <div class="head">{{equipmentName}}</div>
            <i @click="visibleDialog=false" class="close iconfont iconicon_close"></i>
          </div>
          <div class="detail">
            <div class="cont">
                <div> <span>设备类型：</span>{{clickItem.typeName}}</div>
                <div v-if="clickItem.Gtemp && systemType=='kongtiao'"><span>送风温度：</span>{{clickItem.Gtemp}}</div>
                <div v-if="clickItem.Jtemp && systemType=='kongtiao'"><span>回风温度：</span>{{clickItem.Jtemp}}</div>
                <div v-if="clickItem.Gtemp && systemType=='lengji'"><span>供水温度：</span>{{clickItem.Gtemp}}</div>
                <div v-if="clickItem.Jtemp && systemType=='lengji'"><span>加水温度：</span>{{clickItem.Jtemp}}</div>
                <div v-if="clickItem.electricCurrent"> <span>电流：</span>{{clickItem.electricCurrent}}(A)</div>
                <div  v-if="clickItem.Voltage"><span>电压：</span>{{clickItem.Voltage}}(V)</div>
                <div v-if="clickItem.personNum">当前客流量：{{clickItem.personNum}}人</div>
                <div v-if="clickItem.wState==0"><span>设备状态：</span><span class="colorGrey">下线</span></div>
                <div v-else-if="clickItem.wState==1"><span>设备状态：</span><span class="colorGreen">正常</span></div>
                <div v-else><span>设备状态：</span><span class="colorRed">故障</span></div>
                 <div><span>运行状态：</span>
                <template v-if="clickItem.state!=2">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      :value="clickItem.state"
                      active-color="#82edc0" active-text="ON"
                      inactive-color="#ccc" inactive-text="OFF"
                     @change="changeStatus(clickItem.id,clickItem.state==0?1:0,clickItem)">
                    </el-switch>
                </template>
                <template v-else>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      :value="clickItem.state"
                      active-color="#82edc0" active-text="ON"
                      inactive-color="#ccc" inactive-text="OFF"
                      disabled>
                    </el-switch>
                </template>
                </div>
                <div><span>设备描述：</span>{{clickItem.note}}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 报警 -->
     <transition v-if="isWarning && (systemType=='lengji' || systemType=='fangdao'|| systemType=='menjin'
     || systemType=='diantijiankong'|| systemType=='keliutongji')">
      <div class="warningDom">
        <div class="warningBorder" >
            <transition name="el-fade-in-linear" >
              <div class="warningTips" ref="warningDom">
                <div class="divBorder"></div>
                <div class="divContent">
                  <span class="tips" v-for="(item,index) in ewarningTipsList" :key="index">
                    {{index+1}}、{{item.note}}
                  </span>
                  <div class="opr">
                    <div @click="isWarning=false">忽略</div>
                    <div @click="isWarning=false">挂起</div>
                    <div @click="isWarning=false">处理</div>
                  </div>
                </div>
              </div>
            </transition>
        </div>
      </div>
    </transition>

  </div>
</template>
 <script>
import axios from "../../axios.js";
import topM from "./components/topM.vue";
export default {
  name: "miniMap",
  components: {
    topM,
  },
  data() {
    return {
      // 系统title信息
      systemType:this.$route.query.type,
      pageObj: {pageName: sessionStorage.getItem('systemName'),page:'map'},

      canvas: null,
      context: null,
      img: null,
      imgX: -200, //图片起点X
      imgY: -500, //图片起点Y
      imgWidth: 0,
      imgHeight: 0,
      imgScale: 2, //图片放大比列
      MINIMUM_SCALE: 1, //图片最小缩放比列
      MAXIMUM_SCALE: 10, //图片最大缩放比列
      pos: {}, //记录鼠标起点位置
      posl: {}, //记录鼠标移动位置
      dragging: false, //是否缩放
      deviceList: [], //未定位的设备列表
      canvasWidth: 0, //画布宽
      canvasHeight: 0, //画布高
      imgSrc: require('../../assets/img/map.png'),
      scaleX: 1, //画布与屏幕的宽的比例，
      scaleY: 1, //画布与屏幕的高的比例，

      locationEi:[],
      isWheel:false,
      typeSelected:'map',//图例 列表
      floorNum:1,//楼层
      floorNumString:'01',

      equipmentName:'', //设备详情
      visibleDialog:false,
      videoVisible:false,//视频监控
      screenVisible:false,//信息发布


      alarmList:[],
      clickItem:{},
      isWarning:true,//报警
      ewarningTipsList:[],//报警列表

    };
  },
  created() {},
  mounted() {
      console.log(this.systemType)
      let $this = this;
      $this.h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight; //屏幕可视高度
      $this.w = document.documentElement.clientWidth; //屏幕可视宽度
    this.canvasWidth = document.getElementById("drawing").offsetWidth;
    this.canvasHeight = document.getElementById("drawing").offsetHeight;
    if ($this.w > $this.h) {
      this.$refs.visibleDialog.style.width = this.w * 0.5 + "px";
      this.$refs.visibleDialog.style.height = this.h * 0.75 + "px";

      this.$refs.videoDialog.style.width = this.w * 0.6 + "px";
      this.$refs.videoDialog.style.height = this.h * 0.8 + "px";

      this.$refs.screenDialog.style.width = this.w * 0.6 + "px";
      this.$refs.screenDialog.style.height = this.h * 0.8 + "px";
    } else {
      this.$refs.visibleDialog.style.width = this.w * 0.85 + "px";
      this.$refs.visibleDialog.style.height = 270 + "px";

      this.$refs.videoDialog.style.width = this.w * 0.9 + "px";
      // this.$refs.videoDialog.style.height = 230 + "px";

      this.$refs.screenDialog.style.width = this.w * 0.9 + "px";
      // this.$refs.screenDialog.style.height = 230 + "px";
    }
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",this.renderResize, false);

    this.$nextTick(()=>{
      this.getLocationEi();
      this.geteWarningTipsList();
      this.loadImg(this.imgSrc);
    })
  },
  watch: {
    nowSystemType(val){
      location.reload();
    }
  },
  computed:{
    nowSystemType(){
      return this.$route.query.type;
    }
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    // 监听浏览器横竖屏
    renderResize() {
      if (window.orientation === 180 || window.orientation === 0) {
        location.reload();
      }
      if (window.orientation === 90 || window.orientation === -90 ){
        location.reload();
      }
    },
    touchstart(e) {
      console.log("start");
      this.dragging = true;
      this.isTouch = true;
      if (e.touches.length >= 2) {
        this.start = e.touches;
      }
      this.pos = this.windowToCanvas(
        e.touches[0].clientX,
        e.touches[0].clientY
      ); //坐标转换，将窗口坐标转换成canvas的坐标
    },
    touchmove(e) {
      let $this = this;
      e.preventDefault();
      console.log(e.touches);
      // 一根 手指 执行 目标元素移动 操作  e.touches[0].clientY
      if (e.touches.length == 1 && $this.isTouch) {
        console.log("移动");
        $this.isWheel = false;
        if ($this.dragging && this.imgScale > 1) {
          $this.posl = $this.windowToCanvas(
            e.touches[0].clientX,
            e.touches[0].clientY
          );
          let x = $this.posl.x - $this.pos.x,
            y = $this.posl.y - $this.pos.y;
          $this.imgX += x;
          $this.imgY += y;
          $this.pos = JSON.parse(JSON.stringify($this.posl));
          $this.drawImage(); //重新绘制图片
        }
      }
    },
    touchend(e) {
      console.log("end");
      this.dragging = false;
      this.isWheel = false;
    },
    /*canvas配置*/
    loadImg: function() {
      let $this = this;
      $this.canvas = document.getElementById("canvas"); //画布对象z
      console.log($this.canvas)
      $this.context = $this.canvas.getContext("2d"); //画布显示二维图片
      $this.canvas.width = $this.canvasWidth; //设置canvas画布宽
      $this.canvas.height = $this.canvasHeight; //设置canvas画布高
      $this.img = new Image();
      $this.img.onload = function() {
        $this.drawImage();
      };
      this.img.src = this.imgSrc;
      console.log($this.img.width)
      console.log($this.img.height)
    },
    /*canvas绘制图片*/
    drawImage: function() {
      let $this = this;
      this.context.clearRect(0, 0, $this.canvasWidth, $this.canvasHeight);
      // 保证  imgX  在  [img.width*(1-imgScale),0]   区间内
      if ($this.imgX < $this.img.width * (1 - $this.imgScale)) {
        $this.imgX = $this.img.width * (1 - $this.imgScale);
      } else if ($this.imgX > 0) {
        $this.imgX = 0;
      }

      // 保证  imgY   在  [img.height*(1-imgScale),0]   区间内
      if ($this.imgY < $this.img.height * (1 - $this.imgScale)) {
        $this.imgY = $this.img.height * (1 - $this.imgScale);
      } else if ($this.imgY > 0) {
        $this.imgY = 0;
      }
      $this.imgWidth = $this.canvasWidth * $this.imgScale;
      $this.imgHeight = $this.canvasHeight * $this.imgScale;
      console.log('$this.imgX:'+$this.imgX);
      this.context.drawImage(
        $this.img, //规定要使用的图像、画布或视频。
        0,
        0, //开始剪切的 x 坐标位置。
        $this.img.width,
        $this.img.height, //被剪切图像的高度。
        $this.imgX,
        $this.imgY, //在画布上放置图像的 x 、y坐标位置。
        $this.canvasWidth * $this.imgScale,
        $this.canvasHeight * $this.imgScale //要使用的图像的宽度、高度
      );
      console.log(this.img);
      this.getLocationEi();
    },
     /*获取已定位设备并绘制位置*/
    getLocationEi: function() {
      let $this = this;
      this.locationEi = [];
      axios.fetchGet('/deviceList').then((data) => {
        this.locationEi=data.data;
        this.locationEi.forEach(item => {
            this.$set(item, 'positionX', (item.location.X / 100) * this.imgWidth + this.imgX);
            this.$set(item, 'positionY', (item.location.Y / 100) * this.imgHeight + this.imgY);
        });
        if(this.systemType=='jiankong' || this.systemType=='fangdao' || this.systemType=='menjin'
          || this.systemType=='dianzixungeng'|| this.systemType=='xiaofangxitong'
          || this.systemType=='gonggongzhaoming' || this.systemType=='keliutongji'
          ||this.systemType=='xinxifabu' || this.systemType=='beijingyinyue'){
            this.deviceList = this.locationEi.filter((item) => {
                return (item.level == this.floorNum && item.type  == this.systemType);
            });
          }else{
            this.deviceList = this.locationEi.filter((item) => {
                return item.type == this.systemType;
            });
          }

      })
    },
     /*转换坐标*/
    windowToCanvas: function(x, y) {
      let box = this.canvas.getBoundingClientRect(); //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
      return {
        x: x - box.left - (box.width - canvas.width) / 2,
        y: y - box.top - (box.height - canvas.height) / 2
      };
    },
    // 改变视图
    changeZoom(type){
      let $this=this;
      $this.isWheel = true;
      if (type=='up') {
          if($this.imgScale>=2.2) return;
          $this.imgScale += 0.1;
      } else if(type=='down'){
          if($this.imgScale<=1) return;
          $this.imgScale -= 0.1;
      } 
      $this.drawImage();
    },
    getEquipmentAlarm(eiid,item){
      let $this=this;
      if($this.systemType == 'jiankong'){
        $this.videoVisible=true;
      }else if($this.systemType=='xinxifabu'){
        $this.screenVisible=true;
      }else{
        $this.visibleDialog=true;
      }
       this.equipmentName=item.name;
       this.clickItem=item;
    },
    changeStatus(id,state,clickItem){
      this.$set(clickItem,"state",state);
    },
    geteWarningTipsList(){ 
      if(this.systemType=='menjin'){
         this.ewarningTipsList=[
          {id:'01',note:'M-1F-5门锁故障，不能锁门'},
          {id:'02',note:'M-1F-1门锁故障，不能自动关门'},
          {id:'03',note:'M-1F-2门锁故障，不能锁门'},
          {id:'04',note:'M-1F-3门锁故障，不能自动关门'}
        ];
      }else if(this.systemType=='diantijiankong'){
         this.ewarningTipsList=[
          {id:'01',note:'15电梯出现故障，电梯门开不了'},
        ];
      }  
    },

  },
};
</script>
<style scoped lang="scss">
@import "../../assets/css/mini/zoomBox";
@import "../../assets/css/mini/equipmentSet";
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
