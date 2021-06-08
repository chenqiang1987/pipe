<template>
  <div id="map">
    <el-row :gutter="15">
      <el-col :span="13">
        <div class="left">
          <canvas ref="route" id="route" width="947.2" height="383.36" style="border: solid 1px grey"></canvas>
          <img
            v-show="false"
            ref="routeImg"
            src="../../assets/images/sim-ugtrench.png"
          >
        </div>
      </el-col>
      <el-col :span="5" :offset="5">
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
            <div class="warning">
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
              <div class="task-row">
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
              <div class="task-row">
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
import mapImg from "@/assets/images/平面图.jpg";
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
      const canvas = this.$refs.route;
      let ctx = null;
      if (canvas.getContext) {
          ctx = canvas.getContext('2d');
      }
      const img = this.$refs.routeImg;
      img.onload = function () {
        console.log(img)
        ctx.drawImage(img, 0, 0, 947.2, 383.36);
      }
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
    height: 819px;
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
