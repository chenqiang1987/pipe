<template>
  <div id="sensor">
    <el-form class="deliverForm" label-position="top" label-width="80px">
      <img src="@/assets/images/sensor.png" alt="sensor">
      <el-form-item label="传感器">
        <el-select v-model="cur_sensorIds" placeholder="请选择传感器" multiple clearable>
          <el-option v-for="item in sensors" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="接收时间">
        <div class="block">
          <el-date-picker
            v-model="deliverForm.receiveTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </el-form-item>-->
      <el-button class="confirm-btn deliver" size="small" @click="setSensor">确定</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "../store/action-types";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      cur_machine_sensorIds: (state) => state.sensor.cur_machine_sensorIds,
      curRobot: (state) => state.machine.curRobot,
      sensors: (state) => state.sensor.sensors,
    }),
    cur_sensorIds: {
      get() {
        return this.cur_machine_sensorIds;
      },
      set(value) {
        this[types.CUR_MACHINE_SENSORIDS](value);
      },
    },
  },

  methods: {
    ...mapActions({
      [types.GET_SENSOR_FROM_MACHINE]: `sensor/${[
        types.GET_SENSOR_FROM_MACHINE,
      ]}`,
      [types.SET_SENSORS_FOR_MACHINE]: `sensor/${[
        types.SET_SENSORS_FOR_MACHINE,
      ]}`,
    }),
    ...mapMutations({
      [types.CUR_MACHINE_SENSORIDS]: `sensor/${[types.CUR_MACHINE_SENSORIDS]}`,
    }),
    setSensor() {
      const params = {
        machineId: this.curRobot.id,
        sensorIds: this.cur_sensorIds.join("%2C"),
      };
      this[types.SET_SENSORS_FOR_MACHINE](params)
        .then(() => {
          this.$message.success("设置成功！");
          this.$emit('close')
        })
        .catch((e) => {
          console.log(e);
          // this.$message.error(e);
        });
    },
  },
};
</script>

<style lang="less">
#sensor {
  .deliverForm .el-form-item__label {
    line-height: 0px;
  }

  .confirm-btn {
    &.deliver {
      margin: 0 0 20px 0;
    }
  }
}
</style>