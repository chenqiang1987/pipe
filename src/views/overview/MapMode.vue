<template>
  <div id="map">
    <el-row :gutter="15">
      <el-col :span="19">
        <div class="left" ref="route"></div>
      </el-col>
      <el-col :span="5">
        <div class="right">
          <el-card>
            <div class="title">
              <p>机器人状态</p>
              <p>
                机器人当前数
                <span>1</span>
              </p>
            </div>
            <div class="robot-status">
              <p>当前电量</p>
              <el-progress :percentage="curRobotStatus.restElc"></el-progress>
              <p>零件状态</p>
              <div class="status-label">
                <span :style="successStyle">正常</span>
                <span :style="failedStyle">异常</span>
              </div>
            </div>
          </el-card>

          <el-card>
            <p>事件状态</p>
            <div class="warning" >
              <i class="el-icon-message-solid"></i>
              <div class="msg-group">
                <template v-if="curRobotStatus.faults.length !== 0">
                  <div class="warning-msg" v-for="msg in curRobotStatus.faults" :key="msg">
                    <i class="el-icon-message-solid">
                      <span class="black">{{msg}}</span>
                    </i>
                  </div>
                </template>
                <template v-else>
                  <span>当前一切正常</span>
                </template>
              </div>
            </div>
          </el-card>

          <el-card>
            <p>任务状态</p>
            <div class="task-status">
              <div class="apply-btn">
                <el-button size="mini" @click="applyVisible = true;">申请维修</el-button>
              </div>
              <div class="task-row">
                <div class="task-title">
                  <div :class="circleState">
                    <div class="inner-circle"></div>
                  </div>
                  <p>任务运行</p>
                  <div class="status-label">
                    <span :style="successStyle">正常</span>
                    <span :style="failedStyle">故障</span>
                  </div>
                </div>
                <el-progress :text-inside="true" :percentage="100" :color="taskProgress"></el-progress>
              </div>
              <div class="task-row" style="display: none;">
                <div class="task-title">
                  <div class="double-circle">
                    <div class="inner-circle"></div>
                  </div>
                  <p>维修进度</p>
                </div>
                <el-progress :text-inside="true" :percentage="repairState" color="red"></el-progress>
                <div class="fix-status">
                  <span>已申请维修</span>
                  <span>维修中</span>
                  <span>维修完成</span>
                </div>
              </div>
              <div class="task-row" style="display: none;">
                <div class="task-title">
                  <div class="double-circle blue">
                    <div class="inner-circle"></div>
                  </div>
                  <p>专家协助状态</p>
                </div>
                <el-progress :text-inside="true" :percentage="100"></el-progress>
                <p style="font-size: 0.5rem">{{curRobotStatus.expertState}}</p>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="申请维修" :visible.sync="applyVisible" @close="resetForm('applyForm')">
      <el-form :model="applyForm" ref="applyForm" :rules="applyRules">
        <el-form-item label="工单编号" prop="code">
          <el-input v-model="applyForm.code" placeholder="请输入工单编号"></el-input>
        </el-form-item>
        <el-form-item label="维修名称" prop="content">
          <el-select v-model="applyForm.content" placeholder="请选择维修内容">
            <el-option v-for="item in contents" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修人员" prop="serviceman">
          <el-input v-model="applyForm.serviceman" placeholder="请输入维修人"></el-input>
        </el-form-item>
        <el-form-item label="维修简述" prop="sketch">
          <el-input type="textarea" v-model="applyForm.sketch" placeholder="简述维修内容"></el-input>
        </el-form-item>
        <el-form-item label="执行人" prop="operator">
          <el-select v-model="applyForm.operator" placeholder="请选择执行人">
            <el-option v-for="op in operators" :key="op.id" :label="op.name" :value="op.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="value" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleApply">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="返回充电" :visible.sync="rechargeVisible">
      <el-form label-width="90px">
        <el-form-item label="机器人名称" prop="name">
          <span>ces</span>
        </el-form-item>
        <el-form-item label="电量" prop="elec">
          <el-progress
            :percentage="85"
            :color="taskProgress"
            style="height: 40px; line-height: 40px"
          ></el-progress>
        </el-form-item>
        <el-form-item label="充电桩" prop="operator">
          <el-select v-model="applyForm.operator" placeholder="请选择充电桩">
            <el-option v-for="op in operators" :key="op.id" :label="op.name" :value="op.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="dialogVisible = false">确认充电</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import robotImg from "@/assets/images/robot.png";
import rechargeImg from "@/assets/images/recharge.jpg";
import mapImg from "@/assets/images/sim-ugtrench.png";
import { mapState, mapActions } from "vuex";
import * as types from "@/store/action-types";

export default {
  data() {
    return {
      value: "",
      applyVisible: false,
      rechargeVisible: false,
      applyForm: {},
      contents: [
        {
          id: 0,
          name: "test",
        },
      ],
      operators: [
        {
          id: 0,
          name: "test",
        },
      ],
      applyRules: {
        name: [
          {
            required: true,
            message: "请输入工单编号",
            trigger: ["change", "blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入维修名称",
            trigger: ["change", "blur"],
          },
        ],
      },
      robots: [
        {
          id: 1,
        },
      ],
      curRobotStatus: {
        restElc: 0,
        hardWareState: "",
        faults: [],
        messionState: "",
        repairState: "",
        expertState: "",
      },
    };
  },
  computed: {
    ...mapState({
      curRobot: (state) => state.machine.curRobot,
      statistic: (state) => state.notification.statistic
    }),
    successStyle() {
      return this.curRobotStatus.hardWareState === "正常" ||
        this.curRobotStatus.messionState === "正常"
        ? { color: "green" }
        : null;
    },
    failedStyle() {
      return this.curRobotStatus.hardWareState === "正常" ||
        this.curRobotStatus.messionState === "正常"
        ? null
        : { color: "red" };
    },
    // taskProgress() {
    //   return this.curRobotStatus.hardWareState === "正常" ? "green" : "red";
    // },
    circleState() {
      return this.curRobotStatus.hardWareState === "正常"
        ? "double-circle green"
        : "double-circle";
    },
    repairState() {
      let per = 0;
      if (this.curRobotStatus.repairState !== "已申请维修") {
        if (this.curRobotStatus.repairState === "维修中") {
          per = 50;
        } else if (this.curRobotStatus.repairState !== "维修完成") {
          per = 100;
        }
      }
      return per;
    },
  },
  methods: {
    ...mapActions({
      [types.MACHINE_STATE]: `machine/${[types.MACHINE_STATE]}`,
    }),

   taskProgress() {
      return this.curRobotStatus.hardWareState === "正常" ? "green" : "red";
    },

    drawRoute() {
      //  const dt = [
      //   [170.41129 - 105, 767 - 596.84326],
      //   [171.50153 - 105, 767 - 586.4198],
      //   [172.94734 - 105, 767 - 526.43414],
      //   [170.49973 - 105, 767 - 463.52292],
      //   [172.91435 - 105, 767 - 401.4689],
      //   [173.5568 - 105, 767 - 338.61276],
      //   [177.44069 - 105, 767 - 277.1262],
      //   [200.56612 - 105, 767 - 228.82512],
      //   [182.63377 - 105, 767 + 50 - 240.96059],
      //   [184.00105 - 105, 767 + 50 - 242.06496],
      //   [244.40088 - 105, 767 + 50 - 241.3978],
      //   [307.36765 - 105, 767 + 50 - 238.63698],
      //   [370.3371 - 105, 767 + 50 - 240.28041],
      //   [433.0501 - 105, 767 + 50 - 239.16263],
      //   [495.84634 - 105, 767 + 50 - 239.1822],
      //   [558.8674 - 105, 767 + 50 - 239.74986],
      //   [603.0548 - 105, 767 + 50 - 222.8146],
      //   [610.4767 - 105, 767 + 50 - 212.55797],
      //   [608.9532 - 105, 767 + 50 - 226.58966],
      //   [603.6934 - 105, 767 + 50 - 269.50052],
      //   [598.95105 - 105, 767 + 50 - 262.3923],
      //   [608.70776 - 105, 767 + 50 - 277.6831],
      //   [591.36786 - 105, 767 + 50 - 263.5407],
      //   [544.5377 - 105, 767 + 50 - 247.69945],
      //   [535.7476 - 105, 767 + 50 - 245.36388],
      //   [441.63858 - 105, 767 + 50 - 248.90108],
      //   [441.63858 - 105, 767 + 50 - 248.90108],
      //   [407.12198 - 105, 767 + 50 - 249.74236],
      //   [381.51434 - 105, 767 + 50 - 248.81282],
      //   [381.48724 - 105, 767 + 50 - 248.8103],
      //   [348.01877 - 105, 767 + 50 - 247.43015],
      //   [296.1811 - 105, 767 + 50 - 246.03406],
      //   [251.63594 - 105, 767 + 50 - 242.76828],
      //   [188.63301 - 105, 767 + 50 - 234.03305],
      //   [211.72057 - 105, 767 + 50 - 233.51497],
      //   [203.65245 - 105, 767 + 50 - 236.53253],
      //   [197.04712 - 105, 767 + 50 - 237.74843],
      //   [182.4406 - 105, 767 + 50 - 265.92307],
      //   [177.38675 - 105, 767 + 50 - 289.3608],
      //   [178.23627 - 105, 767 + 50 - 281.1469],
      //   [178.0617 - 105, 767 + 50 - 278.69565],
      //   [182.90213 - 105, 767 + 50 - 340.21262],
      //   [177.09886 - 105, 767 + 50 - 392.56238],
      //   [169.56638 - 105, 767 + 50 - 456.83307],
      //   [176.22577 - 105, 767 + 50 - 538.897]
      // ];

      const route = this.$echarts.init(this.$refs.route, "light");
      const option = {
        grid: {
          id: "mapGrid",
          show: false,
          left: 0,
          top: 0,
          containLabel: true,
        },
        xAxis: {
          show: false,
          min: 0,
          max: 1303,
          splitLine: { show: false },
        },
        yAxis: {
          show: false,
          min: 0,
          max: 719,
          splitLine: { show: false },
        },
        series: {
          type: "line",
          smooth: true,
          data: [],
          color: "#C6706D",
          symbol: "circle",
          itemStyle: {
            normal: {
              color: "#C6706D"
            }
          }
        },
        graphic: [
          {
            type: "image",
            id: "robot",
            left: -100,
            bottom: -100,
            z: 100,
            bounding: "all",
            style: {
              image: robotImg,
              width: 30,
              height: 42,
              opacity: 1,
            },
            onclick: (e) => {
              console.log(e)
              this.rechargeVisible = true;
            },
          },
          {
            type: "image",
            id: "map",
            left: 0,
            top: 0,
            z: -10,
            bounding: "raw",
            silent: true,
            style: {
              image: mapImg,
              width: 1302.4,
              height: 718.8,
              opacity: 0.8,
            },
          },
          // {
          //   type: "image",
          //   id: "recharge",
          //   left: 187.766796875,
          //   top: 423.3333333333333,
          //   z: 100,
          //   bounding: "all",
          //   style: {
          //     image: rechargeImg,
          //     width: 58,
          //     height: 82,
          //     opacity: 1,
          //   },
          // },
        ],
      };

      route.setOption(option);
      const gridLeft = option.grid.left,
        imgWidth = option.graphic[0].style.width,
        imgHeight = option.graphic[0].style.height;

      const refreshData = (chart, data) => {
        console.log(data);
        let pos = [data.x * 0.055, data.y * 0.075]
        if (!chart) {
          return;
        }
        //更新数据
        if (data.x === -1 || data.y === -1) {
          // pos = [183.0623685, 40.91237999999999]
          pos = [-100, -100]
        }
        let option = chart.getOption();
        let curPos = route.convertToPixel({ gridId: "mapGrid" }, pos);
        console.log(pos)
        console.log(curPos)
        option.graphic[0].elements[0].style.opacity = 1;
        option.graphic[0].elements[0].left = curPos[0] - 30;
        option.graphic[0].elements[0].top = curPos[1] + 42;
        chart.setOption(option);
      }



      // let move = () => {
      //   let i = 0;
      //   return () => {
      //     console.log(this.statistic)
      //     if (i >= dt.length) {
      //       clearInterval(move);
      //     } else {
      //       refreshData(route, dt[i]);
      //       i++;
      //     }
      //   };
      // };
      const move = () => {
        return () => {
          // console.log(this.statistic);
          refreshData(route, this.statistic);
        }
      }

      window.addEventListener("resize", () => route.resize());
      setInterval(move(), 3000);

    },
    getRobotState() {
      this[types.MACHINE_STATE](this.curRobot.id)
        .then((data) => {
          data.restElc = Number(data.restElc);
          this.curRobotStatus = data;

          // todo del this line
          this.curRobotStatus.faults = [];
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleApply() {

    },
  },
  mounted() {
    this.drawRoute();
    this.getRobotState();
  },
};
</script>

<style lang="less">
#map {
  height: 100vh;
  .el-dialog {
    width: 30vw;
    .el-dialog__body {
      overflow: hidden;
    }
    .el-form {
      .el-form-item {
        padding: 0 20px;
        .el-input {
          box-shadow: none;
        }
        .el-select {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
  .circle(@w, @h, @color) {
    width: unit(@w, px);
    height: unit(@h, px);
    background: @color;
    -moz-border-radius: unit(@w / 2, px);
    -webkit-border-radius: unit(@w / 2, px);
    border-radius: unit(@w / 2, px);
  }

  .outer-circle(@w:16, @h:16, @color) when (@color = pink) {
    position: relative;
    .circle(@w, @h, @color);
    .inner-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: unit(-(@h / 4), px);
      margin-left: unit(-(@w / 4), px);
      .circle(@w/2, @h/2, red);
    }
  }

  .outer-circle(@w:16, @h:16, @color) when (@color = #CAE4FF) {
    position: relative;
    .circle(@w, @h, @color);
    .inner-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: unit(-(@h / 4), px);
      margin-left: unit(-(@w / 4), px);
      .circle(@w/2, @h/2, #409eff);
    }
  }

  .outer-circle(@w:16, @h:16, @color) when (@color = #ccfcc6) {
    position: relative;
    .circle(@w, @h, @color);
    .inner-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: unit(-(@h / 4), px);
      margin-left: unit(-(@w / 4), px);
      .circle(@w/2, @h/2, green);
    }
  }

  .left {
    height: 718.8px;
  }
  .right {
    .el-card {
      margin-bottom: 10px;
      padding: 10px;
      .status-label {
        display: flex;
        font-size: 0.8rem;
        text-align: center;
        justify-content: space-around;
        span:nth-of-type(1) {
          margin-right: 10px;
        }
      }
      .el-card__body {
        font-size: 0.9rem;
        padding: 10px;
        .title {
          p:nth-of-type(1) {
            font-size: 1rem;
          }
          p:nth-of-type(2) {
            display: flex;
            align-items: center;
            color: cornflowerblue;
            span {
              font-size: 1.5rem;
              padding: 8px;
            }
          }
        }
        .robot-status {
          color: grey;
          .el-progress {
            margin: 3px 0;
          }
        }
        .warning {
          display: flex;
          margin: 15px;
          align-items: center;
          color: red;
          & > i {
            width: 20%;
            margin-right: 12px;
            font-size: 2rem;
          }
          .msg-group {
            span {
              margin-left: 5px;
              color: grey;
            }
            width: 80%;
            font-size: 0.8rem;
          }
        }
        .task-status {
          .apply-btn {
            width: 100%;
            margin-bottom: 5px;
            overflow: hidden;
            & > button {
              float: right;
              color: #fff;
              background-color: #47cced;
              border-color: #47cced;
            }
          }
          .task-row {
            color: grey;
            .el-progress {
              margin: 5px 0;
              .el-progress-bar__innerText {
                display: block;
                font-size: 0;
              }
            }
            .task-title {
              display: flex;
              width: 100%;
              .double-circle {
                width: 10%;
                margin-right: 5px;
                .outer-circle(16,16,pink);
                &.blue {
                  .outer-circle(16,16,#CAE4FF);
                }
                &.green {
                  .outer-circle(16,16,#ccfcc6);
                }
              }
            }
            p {
              width: 70%;
              height: 16px;
              line-height: 16px;
            }
            .fix-status {
              display: flex;
              width: 100%;
              margin-bottom: 10px;
              font-size: 0.5rem;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
</style>
