<template>
  <div id="motor-cmds">
    <el-form>
      <el-form-item label="巡检点">
        <el-select v-model="targetPositon" placeholder="请选择巡检点">
          <el-option label="区域一" value="1"></el-option>
          <el-option label="区域二" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-button class="confirm-btn" size="small" style="margin: 0 0 20px 0" @click="reconfirm">确定</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import * as types from "../store/action-types";

export default {
  data() {
    return {
      targetPositon: "",
    };
  },
  computed: {
    ...mapState({
      curRobot: (state) => state.machine.curRobot,
    }),
  },
  methods: {
    ...mapActions({
      [types.BATCH_AUTO_MISSIONS]: `mission/${[types.BATCH_AUTO_MISSIONS]}`,
    }),
    reconfirm() {
      this.$confirm("此操作将导致 [自动巡检任务] 取消或中断, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.move()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    move() {
      const params = {
        machineId: this.curRobot.id,
        targetPositon: this.targetPositon,
        type: "half",
      };
      try {
        this[types.BATCH_AUTO_MISSIONS](params)
          .then(() => {
            this.$message.success("更新成功!");
            this[types.GET_AUTO_MISSIONS](this.curRobot.id);
            this.pendingList = [];
            this.$emit("close");
          })
          .catch((e) => {
            console.log(e);
            this.$message.error(e.msg);
          });
      } catch (e) {
        this.$message.error(e);
      }
    },
  },
};
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