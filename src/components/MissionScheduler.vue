<template>
  <div id="mission-scheduler">
    <el-row>
      <div class="mission-btns">
        <el-button type="text" @click="delMission">删除</el-button>
        <el-button icon="el-icon-plus" size="small" @click="addMission">任务</el-button>
      </div>
    </el-row>
    <el-row class="mission-list">
      <div class="mission-details added" v-for="(mission, i) in missions" :key="mission.id">
        <p>任务 {{i + 1}}</p>
        <!-- <p>内容：{{mission.content}}</p> -->
        <p>时间：{{mission.start}}</p>
      </div>
      <div class="mission-details wait" v-for="(mission, i) in pendingList" :key="`key_${i}`">
        <p>任务 {{curMissionIdx + i}}</p>
        <!-- <el-select v-model="mission.content" placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
        </el-select>-->
        <el-time-picker
          v-model="mission.start"
          type="datetime"
          placeholder="选择日期时间"
          value-format="HH:mm:ss"
        ></el-time-picker>
      </div>
    </el-row>
    <el-row>
      <el-button class="confirm-btn" size="small" @click="batchUpdate">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import * as types from "../store/action-types";
import { afterCurrentTime } from "../utils/timeUtils";

export default {
  data() {
    return {
      pendingList: [],
    };
  },
  computed: {
    ...mapState({
      curRobot: (state) => state.machine.curRobot,
      robots: (state) => state.machine.robots,
      missions: (state) => state.mission.missions,
      sensors: (state) => state.sensor.sensors,
    }),
    curMissionIdx() {
      return this.missions.length + 1;
    },
    missionNum() {
      return this.missions.length + this.pendingList.length;
    },
  },
  methods: {
    ...mapMutations({
      [types.SET_CUR_MACHINE]: `machine/${[types.SET_CUR_MACHINE]}`,
    }),
    ...mapActions({
      [types.GET_AUTO_MISSIONS]: `mission/${[types.GET_AUTO_MISSIONS]}`,
      [types.BATCH_AUTO_MISSIONS]: `mission/${[types.BATCH_AUTO_MISSIONS]}`,
      [types.GET_ALL_SENSORS]: `sensor/${[types.GET_ALL_SENSORS]}`,
      [types.GET_SENSOR_FROM_MACHINE]: `sensor/${[
        types.GET_SENSOR_FROM_MACHINE,
      ]}`,
      [types.SET_SENSORS_FOR_MACHINE]: `sensor/${[
        types.SET_SENSORS_FOR_MACHINE,
      ]}`,
    }),
    addMission() {
      if (this.missionNum >= 5) {
        this.$message.error("最多添加5个任务！");
        return;
      }
      const temp = {
        machineId: this.curRobot.id,
        content: "",
        start: "",
        end: "",
      };
      this.pendingList.push(temp);
    },
    delMission() {
      if (this.pendingList.length !== 0) {
        this.pendingList.pop();
      } else if (this.missions.length !== 0) {
        this.missions.pop();
      } else return;
    },
    batchUpdate() {
      let pendingStarts = this.pendingList.map((i) => i.start);
      let missionStarts = this.missions.map((i) => i.start);
      let flag = true;
      pendingStarts.forEach((time, index) => {
        if (!time) {
          flag = false;
          setTimeout(() => {
            this.$message.error(
              `任务 ${this.curMissionIdx + index} 未选择时间！`
            );
          }, 300);
          return;
        }
        // if (!afterCurrentTime(time)) {
        //   flag = false;
        //   setTimeout(() => {
        //     this.$message.error(
        //       `任务 ${
        //         this.curMissionIdx + index
        //       } 设置时间早于当前时间，请重新设置！`
        //     );
        //   }, 300);
        // }
      });
      if (flag) {
        let params = {
          machineId: this.curRobot.id,
          start: [...pendingStarts, ...missionStarts],
          type: 'auto'
        };
        try {
          this[types.BATCH_AUTO_MISSIONS](params)
            .then(() => {
              this.$message.success("更新成功!");
              this[types.GET_AUTO_MISSIONS](this.curRobot.id);
              this.pendingList = [];
              this.$emit('close');
            })
            .catch((e) => {
              console.log(e)
              this.$message.error(e.msg);
            });
        } catch (e) {
          this.$message.error(e);
        }
      }
    },
  },
};
</script>

<style lang="less">
#mission-scheduler {
  .mission-btns {
    float: right;
    margin-right: 20px;
    margin-bottom: 10px;
    button:nth-of-type(1) {
      color: darkgrey;
      margin-right: 5px;
    }
    button:nth-of-type(2) {
      background-color: orange;
      color: white;
    }
  }
  .mission-list {
    .mission-details {
      padding: 5px 35px;
      margin: 5px 0;
      p {
        margin: 8px 0;
      }
      p:first-child {
        margin-left: -3px;
      }
      &.added {
        background: rgb(247, 253, 254);
      }
      &.wait {
        .el-select {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
