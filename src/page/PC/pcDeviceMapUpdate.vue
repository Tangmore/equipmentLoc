<template>
    <div class="main">
     <!-- <top></top>-->
      <div class="container" ref="container" style="padding:0">
        <div class="plan"> 
          <div class="datas" >
            <!--图纸-->
            <div class="drawing" style="width: 100%;position: relative">
              <div id="drawing" style="width: 100%;height: 100%;position: absolute;right:0">
                <canvas class="" ref="canvas" id="canvas" style="position:absolute;z-index: 1;"></canvas>
              </div>
              <div class="devices" style="z-index: 5">
                <!--未定位-->
                <div class="unlocked" id="client">
                  <div class="list">
                    <div class="angle1"></div>
                    <div class="angle2"></div>
                    <div class="angle3"></div>
                    <div class="angle4"></div>
                    <div class="headline">
                      <div @click="getByAttId('1')">设备</div> 
                    </div>
                    <div style="width: 100%;height: calc(100% - 350px);display: flex;flex-direction: column;overflow-y: auto;overflow-x: hidden">
                      <template v-if="locationType=='equipment'">
                        <div class="it" v-for="(item,index) in deviceList" :key="index" v-if="item.isShow==true" 
                          :id="item.eiid" :data-slid="item.sl_id" v-drag="{set:set}"
                          :style="'top:'+(index+1)*50+'px'" :data-top="(index+1)*50" data-type="equipment" 
                          :data-index="index" :data-note="item.note">{{item.note}}-{{item.typename}}
                        </div>
                      </template> 
                    </div> 
                  </div>
                </div>
                <!--已定位-->
                <div style="width: 80%;height: 100%" id="canvasBgm">
                  <template v-for="(item,index) in resPosArr">
                    <!--slt_id:[1.设备]-->
                    <template v-if="item.slt_id=='1'">
                      <template v-if="item.state==1">
                        <el-tooltip effect="dark" placement="top-start" :key="index">
                          <div slot="content">设备说明：{{item.note}}<br/>所属系统：{{item.esname}}<br/>
                            设备型号：{{item.model}}<br/>设备类型：{{item.typename}}
                          </div>
                          <div class="tag tagWOffline iconkongtiao" :id="item.eiid" :data-num="item.location_id" data-type="equipment"  v-drag="{set:set}"
                              :style="'left:'+item.positionX+'px;top:'+item.positionY+'px'" @click="deletePos(item.eiid,item.location_id)">
                            {{item.iconkongtiao}}
                          </div>
                        </el-tooltip>
                      </template>
                    </template>
                  </template>
                  <template v-for="(drag,dragIndex) in dragList">
                    <div class="dragIem" :key="dragIndex" :style="'left:'+drag.positionX+'px;top:'+drag.positionY+'px;'">{{drag.note}}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <script>   
    export default {
      name: "pcDeviceMapUpdate", 
      data() {
        return {
          id:this.$route.query.id,
          pid: this.$route.query.pid,//房屋资源上级id
          hrid: '',//房屋资源id
          canvas: null,
          context: null,
          img:null,
          imgSrc: require("../../assets/img/map.png"),
          deviceList: [],//未定位的设备列表
          canvasWidth: 0,//画布宽
          canvasHeight: 0,//画布高
          imgX: 0,//图片起点X
          imgY: 0,//图片起点Y
          imgWidth: 0,
          imgHeight: 0,
          imgScale: 1,//图片放大比列
          MINIMUM_SCALE: 1,//图片最小缩放比列
          scaleX: 1,//画布与屏幕的宽的比例，
          scaleY: 1,//画布与屏幕的高的比例，
          locationEi:[],//已定位设备
          resPosArr: [],//已绘制定位设备
          imgs: [],
          clicked: 0,
          imgLocked: null,
          addDevicePos: [],
          minWidth:0,
          maxWidth:0,
          maxHeight:0,
          currentPage1: 1,//返回的请求页面
          total: 0,//总条目
          page: 1,//当前页
          pageSize: 15,//每页条目
          totalPage:1,
          pageNum: 1,
          papers:[],//需要定位的下一级房屋资源
          locationType:'equipment',
          attachment_id:'',//图纸id
          sltId:'1',//标签类型id
          staticLabel:[],//标签查询
          isWheel:false,
          isClick:false,//判断元素是拖拽还是点击
          drag: false,  
          dragList:[],
        }
      },
      mounted() {
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//屏幕可视高度
        let w = document.documentElement.clientWidth;//屏幕可视宽度
        this.$refs.container.style.height = h + 'px';
  
        this.minWidth= document.getElementById('client').offsetWidth;
        this.maxWidth= document.getElementById('drawing').offsetWidth;
        this.maxHeight= document.getElementById('client').offsetHeight;
  
        this.canvas = document.getElementById('canvas'); //画布对象
        this.canvasWidth = document.getElementById('drawing').offsetWidth;
        this.canvasHeight = document.getElementById('drawing').offsetHeight;
        window.addEventListener('mousewheel', this.mousewheel, false);
        window.addEventListener('mousedown', this.mousedown, false);
        window.addEventListener('mousemove', this.mousemove, false);
        window.addEventListener('mouseup', this.mouseup, false);
      },
      created() {
        this.getHouseResources();  
      },
      methods: { 
        //获取房屋资源图纸
        getHouseResources: function () {
          let $this=this;
             this.$nextTick(function () { 
              $this.getLocationEi();
              $this.loadImg();
              $this.getByAttId('1')
            });
        },
        //查询未定位设备(1)/房屋资源(2)/巡检(3)
        getByAttId: function (val) {
          let $this=this;
          $this.sltId=val; 
          this.deviceList=[
            {eiid: "01",
            esname: "门禁", 
            location_id: "0F55B5BC9C0248589D2A874E35C880A8",
            location_level: "1",
            model: "MJ-0905",
            note: "A区9栋1单元1层大门",
            sl_id: "98628CD268F34F96856CD9AB86D2A368",
            slt_id: "1",
            state: 1,
            statename: "开",
            typename: "门禁",
            wstate: 1}
          ];
          this.deviceList.forEach(item=>{
             this.$set(item,'isShow',true)
          })
        }, 
        //canvas配置
        loadImg: function () {
          let $this = this;
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
          if(this.isWheel){
            this.getLocationEi();
          }else{
            this.locationEiSet();
          }
  
        },
        //获取已定位设备
        getLocationEi: function () {
          let $this=this;
          this.locationEi=[{
            eiid: "02",
            esname: "门禁",
            location: "{X:100.71875,Y:158.69797}",
            location_id: "0F55B5BC9C0248589D2A874E35C880A8",
            location_level: "1",
            model: "MJ-0905",
            note: "9栋1单元1层大门",
            sl_id: "98628CD268F34F96856CD9AB86D2A368",
            slt_id: "1",
            state: 1,
            statename: "开",
            typename: "门禁",
            wstate: 1
          }];

           this.$nextTick(function () {
              $this.locationEiSet();
           })
        },
        //已定位设备并绘制位置
        locationEiSet:function(){
          this.locationEi.forEach(item => {
            let position = item.location;
            this.$set(item, 'positionX', (position.X / 100) * this.imgWidth+this.imgX);
            this.$set(item, 'positionY', (position.Y / 100) * this.imgHeight+this.imgY);
  
          });
          this.resPosArr = this.locationEi;
          console.log(this.resPosArr)
        },
        //监听鼠标按下
        mousedown: function (event) {
          this.isWheel=false;
          if(event.target.id=='canvasBgm'){
            this.dragging = true;
            this.pos = this.windowToCanvas(event.clientX, event.clientY);  //坐标转换，将窗口坐标转换成canvas的坐标
          }
        },
        //监听鼠标移动
        mousemove: function (event) {
          let $this = this;
          if ($this.dragging && this.imgScale > 1 && !$this.buildingVisible) {
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
        },
        //鼠标滚动事件
        mousewheel(event) {
          let $this = this;
          $this.isWheel=true;
          if (!$this.buildingVisible && !$this.equipmentVisible && !$this.householdVisible && !$this.isSelectVi && !$this.equipmentListVisible) {
            let pos = $this.windowToCanvas(event.clientX, event.clientY);
            let wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40));
            let newPos = {
              x: ((pos.x - $this.imgX) / $this.imgScale).toFixed(2),
              y: ((pos.y - $this.imgY) / $this.imgScale).toFixed(2)
            };
            if (wheelDelta > 0) {// 放大
              $this.imgScale += 0.1;
              if( $this.imgScale>1 &&  $this.imgScale<1.2){
                $this.imgScale=1.2;
              }else if($this.imgScale>1.2 && $this.imgScale<1.5){
                $this.imgScale=1.5;
              }else if($this.imgScale>1.5 && $this.imgScale<1.7){
                $this.imgScale=1.7;
              }else if($this.imgScale>1.7 && $this.imgScale<2){
                $this.imgScale=2;
              }else if($this.imgScale>2){
                $this.imgScale=2;
                $this.isWheel=false;
              }
              $this.imgX = (1 - $this.imgScale) * newPos.x + (pos.x - newPos.x);
              $this.imgY = (1 - $this.imgScale) * newPos.y + (pos.y - newPos.y);
            } else {//  缩小
              $this.imgScale -= 0.1;
              if($this.imgScale>1 && $this.imgScale<1.2){
                $this.imgScale=1;
                $this.level=1;
              }else if($this.imgScale>1.2 && $this.imgScale<1.5){
                $this.imgScale=1.2
                $this.level=2;
              }else if($this.imgScale>1.5 && $this.imgScale<1.7){
                $this.imgScale=1.5;
              }else if($this.imgScale>1.7 && $this.imgScale<2.0){
                $this.imgScale=1.7;
              }else if($this.imgScale<1){
                $this.imgScale=1;
                $this.isWheel=false;
              }
              $this.imgX = (1 - $this.imgScale) * newPos.x + (pos.x - newPos.x);
              $this.imgY = (1 - $this.imgScale) * newPos.y + (pos.y - newPos.y);
            }
            $this.drawImage();
          }
        },
        //window坐标转canvas坐标
        windowToCanvas: function (x, y) {
          let box = this.canvas.getBoundingClientRect();  //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
          return {
            x: x - box.left - (box.width - canvas.width) / 2,
            y: y - box.top - (box.height - canvas.height) / 2
          };
        },
        set: function (num) {
          let X=0;
          let Y=0;
          let that=this;
          X = ((num.location.X -this.imgX )* 100 / this.imgWidth).toFixed(5);
          Y = ((num.location.Y -this.imgY )* 100  / this.imgHeight).toFixed(5);
          let type=num.type;
          num.location.X = X;
          num.location.Y = Y;
          let objId='';
          if (this.addDevicePos.length > 0) {
            let obj = {};
            this.addDevicePos.forEach(item => {
              if(type=='equipment'){
                if (num.objId == item.objId) {
                  this.addDevicePos.splice(this.addDevicePos.indexOf(item.eiid), 1);
                } 
                objId=num.eiid;
              }else if(type=='house'){
                if (num.objId == item.objId) {
                  this.addDevicePos.splice(this.addDevicePos.indexOf(item.hrid), 1);
                } 
                objId=num.hrid;
              } 
              obj = {
                  id: num.id,
                  objId: objId,
                  location: num.location,
                  slId:num.slid,
                  note:num.note
                };
            });
            this.addDevicePos.push(obj);
            this.dragList.push(obj);
          }
          else {
            let arr={};
            if(type=='equipment'){ 
              objId=num.eiid;
            } 
            arr = {
                id: num.id,
                objId: objId,
                location: num.location,
                slId:num.slid,
                note:num.note
              };
            this.addDevicePos.push(arr);
            this.dragList.push(arr);
          }
          this.$nextTick(function () {
            that.getDrag(objId);
          })
        },
        getDrag:function(objId){
          //将新定位的设备加入dragList列表中
          this.dragList.forEach(item => {
            console.log(item);
            this.$set(item, 'positionX', (item.location.X / 100) * this.imgWidth+this.imgX);
            this.$set(item, 'positionY', (item.location.Y / 100) * this.imgHeight+this.imgY);
          });
          //将新定位的设备从deviceList中删除
          this.deviceList.forEach((dev,i)=>{
            if(dev.eiid==objId || dev.hrid==objId || dev.irpid==objId ||dev.tableid==objId){
              this.$set(dev,'isShow',false)
            }
          })
          console.log( this.deviceList);
        },  
        deletePos:function (id,deleteId) {
          let isClick = document.getElementById(id).getAttribute('data-flag');
          console.log(isClick);
          if(isClick !== 'true') {
            return false
          }
          let par = {attachmentId:this.attachment_id,delLocationIds:deleteId,level:this.imgScale};
          let $this=this;
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            }); 
  
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
  
  
        },
        onStart() {
          this.drag = true;
        },
        onEnd(e) {
          this.drag = false;
          console.log(e);
        },
      },
      //拖动元素
      directives: {
        drag(el, bindings) {
          let top = 0;
          let left = 0;
          let that=this;
          let oDiv = el;
          let firstTime='',lastTime='';
          document.onselectstart = function() {
            return false;
          };
          el.onmousedown = function (e) {
            let id = e.target.getAttribute('id') ? e.target.getAttribute('id') : '';
            console.log(id);
            document.getElementById(id).setAttribute('data-flag',false)
            firstTime = new Date().getTime();
            let elTop=e.target.getAttribute('data-top');
            let disx = e.pageX - el.offsetLeft;//鼠标点击时起始位置X
            let disy = e.pageY - el.offsetTop;//鼠标点击时起始位置Y
            document.onmousemove = function (e) {
              el.style.left = e.pageX - disx + 'px';
              el.style.top = e.pageY - disy + 'px';
              if(e.pageX - disx < this.minWidth-10 || e.pageX - disx-(this.minWidth-20) > this.maxWidth || e.pageY - disy<0 || e.pageY - disy>this.maxHeight-20){
                left=0;
                top=0;
                el.style.left = 10 + 'px';
                el.style.top = elTop + 'px';
              }else{
                left = e.pageX - disx;
                top = e.pageY - disy;
              }
  
            };
            document.onmouseup = function (e) {
              document.onmousemove = document.onmouseup = null;
  
              let id = e.target.getAttribute('id') ? e.target.getAttribute('id') : '';
              let ids = e.target.getAttribute('data-num') ? e.target.getAttribute('data-num') : '';
              let type = e.target.getAttribute('data-type') ? e.target.getAttribute('data-type') : '';
              let slid = e.target.getAttribute('data-slid') ? e.target.getAttribute('data-slid') : '';
              let note = e.target.getAttribute('data-note') ? e.target.getAttribute('data-note') : '';
              console.log(note);
              let temp={};
              console.log(id);
              lastTime = new Date().getTime();
              if( (lastTime - firstTime) < 200){
                document.getElementById(id).setAttribute('data-flag',true);
              }else{
                if(type=='equipment'){
                  temp = {
                    id: ids,
                    type:type,
                    objId:e.target.id,
                    eiid: e.target.id,
                    slid:slid,
                    location: {
                      X: left, Y: top
                    },
                    note:note
                  };
                } 
                bindings.value.set(temp);
              } 
            }
          }
        }
      },
    }
  </script>
  
  <style scoped lang="scss">
    @import "../../assets/css/PC/pcDeviceMapUpdate"; 

  </style>
  