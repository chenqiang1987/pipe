<template>
  <div id="motor-cmds">
    <el-form ref="form" :model="form">

        <el-progress :percentage="85" :color="taskProgress" style="height: 40px; line-height: 40px"></el-progress>

      <el-form-item label="机器人">
        <el-select v-model="form.robot" placeholder="请选择机器人">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充电桩">
        <el-select v-model="form.region" placeholder="请选择充电桩">
          <el-option label="区域一" value="1"></el-option>
          <el-option label="区域二" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="small" style="margin: 0 0 20px 0; float: right;">确定充电</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
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
  methods: {
    

   taskProgress() {
      return this.curRobotStatus.hardWareState === "正常" ? "green" : "red";
    },
}
}
</script>

<style lang="less">
#motor-cmds {
  .el-form {
    .el-form-item {
      .el-input {
        box-shadow: none;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>