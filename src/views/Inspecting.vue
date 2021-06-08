<template>
  <div id="inspecting">
    <el-radio-group v-model="modeRadio" fill="#47cced" @change="changeMode">
      <el-radio-button label="全自动巡检"></el-radio-button>
    <!--  <el-radio-button label="半自动巡检"></el-radio-button>
      <el-radio-button label="手动巡检" ></el-radio-button>-->
    </el-radio-group>
    <div class="bg-wrapper">
      <div v-if="isShowRtmpStream" class="container">
        <div v-show="isShowVideoCtl" class="video-top">{{timerLabel}}</div>
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player>
        <div v-show="isShowVideoCtl" class="video-bottom">
          <div class="video-bottom-handler">
            <span>录像</span>
            <span>截图</span>
          </div>
          <div class="video-bottom-button">
            <div class="inner-button"></div>
          </div>
        </div>
      </div>
      <el-aside v-if="asideShow" width="158px">
        <div class="robot">
          <el-dropdown>
            <span class="el-dropdown-link r_title el-icon-caret-bottom">机器人名称</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="r in robots"
                :key="r.serialNumber"
                @click.native="selectRobot(r)"
              >{{r.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <p class="r_name">{{curRobot.name}}</p>
        </div>
        <ul>
          <el-popover
            v-for="item in menus"
            :key="item"
            placement="right"
            width="480"
            trigger="click"
            @show="onPopoverShow(item)"
          >
            <el-card>
              <div slot="header">
                <span>{{item === '信息报警' ? item+'设定值' : item}}</span>
                <i
                  class="el-icon-close"
                  style="float: right; padding: 3px 0; cursor:pointer"
                  @click="closePopover"
                ></i>
              </div>
              <div class="fn-area">
                <template v-if="item === '任务计划'">
                  <MissionScheduler />
                </template>

                <template v-else-if="item === '运动指令'">
                  <MotorCmds />
                </template>

                <template v-else-if="item === '信息回传'">
                  <Sensor />
                </template>

                <template v-else-if="item === '信息显示'">
                  <MsgShow />
                </template>

                <template v-else-if="item === '实时视频流'">
                  <VideoHandler @onHandler="videoContrl" />
                </template>

                <template v-else-if="item === '信息报警'">
                  <Warning />
                </template>

                <template v-else-if="item === '事件记录'">
                  <FailureMsg />
                </template>

                <template v-else-if="item === '返回充电'">
                  <Recharge />
                </template>


                <template v-else-if="item === '手动巡检'">
                  <Manual />
                </template>
              </div>
            </el-card>
            <li slot="reference">{{item}}</li>
          </el-popover>
        </ul>
      </el-aside>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import * as types from "../store/action-types";
import MissionScheduler from "@/components/MissionScheduler";
import Sensor from "@/components/Sensor";
import MsgShow from "@/components/MsgShow";
import Warning from "@/components/Warning";
import FailureMsg from "@/components/FailureMsg";
import MotorCmds from "@/components/MotorCmds";
import VideoHandler from "@/components/VideoHandler";
import Recharge from "@/components/Recharge";
import Manual from "@/components/Manual";
import { parser } from "../utils/timeUtils";

export default {
  components: {
    MissionScheduler,
    Sensor,
    MsgShow,
    Warning,
    FailureMsg,
    MotorCmds,
    VideoHandler,
    Recharge,Manual
  },
  data() {
    return {
      modeRadio: "全自动巡检",
      isShowRtmpStream: false,
      isShowVideoCtl: false,
      pendingList: [],
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "rtmp/flv", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            // src: "rtmp://58.200.131.2:1935/livetv/gxtv", //url地址
            //src: "rtmp://192.168.1.130:554/machineHot/"
			src: "rtmp://192.168.9.253:1935/live/"
          },
        ],
        techOrder: ["flash"],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, //当前时间和持续时间的分隔符
          durationDisplay: true, //显示持续时间
          remainingTimeDisplay: false, //是否显示剩余时间功能
          fullscreenToggle: true, //全屏按钮
        },
        controls: false,
      },
      timer: null,
      timerLabel: "00: 00: 00",
    };
  },
  computed: {
    ...mapState({
      curRobot: (state) => state.machine.curRobot,
      robots: (state) => state.machine.robots,
      missions: (state) => state.mission.missions,
      sensors: (state) => state.sensor.sensors,
    }),
    menus() {
      if (this.modeRadio === "全自动巡检") {
 console.log(1111111111111111111111111)
        return [
          "任务计划",
          "信息回传",
          "信息显示",
          "实时视频流",
          "信息报警",
         // "事件记录",
          "返回充电",


           "手动巡检"
        ];
      } else if (this.modeRadio === "半自动巡检") {
        return [
          "运动指令",
          "信息回传",
          "信息显示",
          "实时视频流",
          "信息报警",
          "事件记录",
          "返回充电",
        ];
      } else  if (this.modeRadio === "手动巡检") {

  // console.log(222222222222222222222222222)

        return;
      }
    },
    asideShow() {
      let isShow = true;
      if (this.modeRadio === "手动巡检" || this.isShowVideoCtl) {


        // this.$confirm(`机器人将原地待机`,'提示', {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   center: true,
        //   type:"warning"
        // });
        isShow = false;
      }
      return isShow;
    },
  },
  async created() {
    await this[types.GET_ALL_SENSORS]();
  },
  methods: {
    ...mapMutations({
      [types.SET_CUR_MACHINE]: `machine/${[types.SET_CUR_MACHINE]}`,
    }),
    ...mapActions({
      [types.GET_AUTO_MISSIONS]: `mission/${[types.GET_AUTO_MISSIONS]}`,
      [types.GET_ALL_SENSORS]: `sensor/${[types.GET_ALL_SENSORS]}`,
      [types.GET_SENSOR_FROM_MACHINE]: `sensor/${[
        types.GET_SENSOR_FROM_MACHINE,
      ]}`,
    }),
    changeMode() {


    },
    showMsg(){

     console.log('22222')
    },
    onPopoverShow(e) {
      if (e === "任务计划") {
        this[types.GET_AUTO_MISSIONS](this.curRobot.id);
      }
      if (e === "信息回传" || e === "信息报警") {
        this[types.GET_SENSOR_FROM_MACHINE](this.curRobot.id);
      }
      if (e === "实时视频流") {
        this.isShowRtmpStream = true;
      } else {
        this.isShowRtmpStream = false;
      }
    },
    closePopover() {
      document.getElementById("app").click();
    },
    selectRobot(cur) {
      this[types.SET_CUR_MACHINE](cur);
    },
    capture() {
      // let canvas = document.createElement("canvas");
      // const ctx = canvas.getContext("2d");
      // let video = document.getElementsByTagName("object")[0];
      // console.log(video)
      // let w = window.innerWidth;
      // let h = (window.innerWidth / 16) * 9;
      // canvas.width = w;
      // canvas.height = h;
      // this.$rasterizeHTML.drawHTML(video).then(function (renderResult) {
      //   ctx.drawImage(renderResult.image, 0, 0, w, h, 0, 0, w, h);
      // });
      // let previewImg  = canvas.toDataURL("image/png");
      // console.log(previewImg);
      // console.log(video)
      // let w = window.innerWidth;
      // let h = (window.innerWidth / 16) * 9;
      // canvas.width = w;
      // canvas.height = h;
      // const ctx = canvas.getContext("2d");
      // console.log(canvas);
      // ctx.drawImage(video, 0, 0, w, h, 0, 0, w, h);
      // let previewImg  = canvas.toDataURL("image/png");
      // console.log(previewImg);
    },
    videoContrl(type) {
      this.playerOptions.controls = false;
      if (type === 0) {
        this.capture();
      }
      this.isShowVideoCtl = true;
      let count = 0;
      this.timer = setInterval(() => {
        count++;
        this.timerLabel = `${parser(parseInt(count / 60 / 60))}: ${parser(
          parseInt(count / 60) % 60
        )}: ${parser(count % 60)}`;
      }, 1000);
      if (type === 0) {
      } else if (type === 1) {
      } else {
        console.log("error");
      }
    },
  },
};
</script>

<style lang="less">
.el-popover {
  padding: 0 !important;
  .el-card {
    border: none;
    max-height: 830px;
    overflow-y: auto;
    .el-card__body {
      padding: 15px 0;
    }
  }
}

.fn-area {
  .el-form {
    padding: 0 7%;
  }
  .confirm-btn {
    float: right;
    margin-top: 20px;
    margin-right: 20px;
    width: 73px;
    background: #47cced;
    color: white;
    &:hover,
    &:focus {
      background: #47cced;
      color: white;
    }
  }
}

#inspecting {
  padding: 20px;
  height: 100%;
  .el-radio-group {
    margin-bottom: 20px;
  }
  .bg-wrapper {
    width: 85vw;
    height: 80vh;
    padding: 7px;
    background: #fff;
    // background: url("../assets/images/map.png") no-repeat;
    // background-size: 100%;
    position: relative;
    .container {
      position: relative;
      margin-bottom: 30px;
      .video-top {
        width: 100%;
        height: 30px;
        line-height: 30px;
        position: absolute;
        top: 0;
        background: #000;
        opacity: 0.8;
        z-index: 10;
        color: #fff;
        text-align: center;
      }
      .video-bottom {
        width: 100%;
        height: 120px;
        position: absolute;
        bottom: 0;
        background: #000;
        opacity: 0.8;
        z-index: 10;
        &-handler {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          span {
            margin: 10px 45px;
          }
        }
        &-button {
          width: 45px;
          height: 45px;
          margin: 0 auto;
          border: 3px solid #fff;
          border-radius: 50%;
          position: relative;
          .inner-button {
            width: 25px;
            height: 25px;
            border: 1px solid red;
            border-radius: 5px;
            background: red;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
    .el-aside {
      height: 350px;
      padding: 3px;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      .robot {
        border-bottom: 1px solid #c9ccd3;
        padding: 10px 20px;
        line-height: 30px;
        .r_title {
          color: #bbc6fc;
          font-size: 1.1rem;
        }
        .r_name {
          font-size: 1rem;
          color: #2c2a3f;
          font-weight: bold;
        }
      }
      ul {
        text-align: center;
        font-size: 0.9rem;
        li {
          &:focus {
            background: #7598ea;
            color: #fff;
          }
          height: 35px;
          line-height: 35px;
          padding-left: 0;
        }
      }
    }
  }
}
</style>
