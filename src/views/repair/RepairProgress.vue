<template>
  <div id="repairProgress">
    <el-row :gutter="20">
      <el-col :span="11">
        <el-card class="order-info">
          <div slot="header">
            <span>工单信息</span>
          </div>
          <el-form label-width="80px">
            <el-form-item label="执行人">
              <span>{{details.exeName}}</span>
            </el-form-item>
            <el-form-item label="损坏内容">
              <span>{{details.content}}</span>
            </el-form-item>
            <el-form-item label="维修人员">
              <span>{{details.repairName}}</span>
            </el-form-item>
            <el-image
              style="width: 150px; height: 100px"
              :src="details.imgsUrl[0]"
              :preview-src-list="[details.imgsUrl]"
            ></el-image>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="13">
        <el-row>
          <el-card class="repair">
            <div slot="header">
              <span>维修</span>
            </div>
            <div>
              <div class="handler">
                <span class="handler-text">工单执行</span>
                <el-button size="medium" style="background: rgb(71,204,237)" @click="start">
                  <span style="color: #fff">开始维修</span>
                </el-button>
              </div>
              <div class="handler">
                <span class="handler-text">远程支持</span>
                <el-button size="medium" style="background: #fff" @click="help">
                  <span style="color: #000">帮助</span>
                </el-button>
              </div>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="feedback">
            <div slot="header">
              <span>工单结束</span>
            </div>
            <div class="wrapper">
              <p>问题是否解决</p>
              <el-button type="info" size="medium" :style="successBg" @click="changeStatus(1)">
                <span style="color: #fff">已解决</span>
              </el-button>
              <el-button type="info" size="medium" :style="failedBg" @click="changeStatus(0)">
                <span style="color: #fff">未解决</span>
              </el-button>
            </div>
            <el-input
              type="textarea"
              v-model="content"
              placeholder="提交解决反馈"
              :autosize="{ minRows: 6, maxRows: 12}"
            ></el-input>
            <el-button
              size="medium"
              style="float: right; margin-top: 2vh; background: rgb(71,204,237)"
              @click="feedback"
            >
              <span style="color: #fff">提交</span>
            </el-button>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
    <!-- <el-dialog title="专家协助" :visible.sync="assistVisible" center :close-on-click-modal="false">
      <Assist :socketData="chatSocket" />
    </el-dialog> -->
  </div>
</template>

<script>
import { getSession, setSession } from "@/utils/local";
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "@/store/action-types";

export default {
  data() {
    return {
      details: null,
      resolved: true,
      successBg: { background: "orange", border: "orange" },
      failedBg: null,
      content: "",
    };
  },
  created() {
    this.details = getSession("curOrder");
  },
  methods: {
    ...mapMutations({
      [types.CHAT_DIALOG_VISIBLE]: `chat/${[types.CHAT_DIALOG_VISIBLE]}`,
    }),
    ...mapActions({
      [types.START_REPAIR]: `maintain/${[types.START_REPAIR]}`,
      [types.RESOLVE_REPAIR]: `maintain/${[types.RESOLVE_REPAIR]}`,
      [types.UNRESOLVE_REPAIR]: `maintain/${[types.UNRESOLVE_REPAIR]}`,
    }),
    start() {
      this.$confirm(`工单执行状态 '${this.details.status}'`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(async () => {
          try {
            await this[types.START_REPAIR](this.details.id);
            this.$message.success("执行成功！");
            this.details.status = "正在维修中";
            setSession("curOrder", this.details);
          } catch (e) {
            console.log(e);
            this.$message.error("执行失败！");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消执行",
          });
        });
    },
    help() {
      this[types.CHAT_DIALOG_VISIBLE](true);
    },
    changeStatus(success) {
      if (success) {
        this.resolved = true;
        this.successBg = { background: "orange", border: "orange" };
        this.failedBg = null;
      } else {
        this.resolved = false;
        this.failedBg = { background: "orange", border: "orange" };
        this.successBg = null;
      }
    },
    async feedback() {
      let query = {
        workId: this.details.id,
        content: this.content,
      };
      if (this.resolved) {
        try {
          await this[types.RESOLVE_REPAIR](query);
          this.$message.success("提交成功！");
          this.details.status = "已经完成";
          setSession("curOrder", this.details);
        } catch (e) {
          console.log(e);
          this.$message.error("提交失败！");
        }
      } else {
        try {
          await this[types.UNRESOLVE_REPAIR](query);
          this.$message.success("提交成功！");
          this.details.status = "维修失败";
          setSession("curOrder", this.details);
        } catch (e) {
          console.log(e);
          this.$message.error("提交失败！");
        }
      }
    },
  },
};
</script>

<style lang="less">
#repairProgress {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-row {
    margin-bottom: 1.8vh;
  }
  .el-card {
    .el-card__body {
      span {
        font-size: 0.9rem;
        color: grey;
      }
    }
    .el-form-item__label {
      color: #000;
      font-size: 0.95rem;
      text-align: left;
      margin-right: 3%;
    }
    &.order-info {
      min-height: 76vh;
      .el-card__body {
        padding: 5% 8%;
      }
    }
    &.repair {
      min-height: 37vh;
      .el-card__body {
        width: 100%;
        height: 28vh;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        .handler {
          margin: 10% 0;
          &-text {
            color: #000;
            font-size: 0.95rem;
            text-align: left;
            margin-right: 30px;
          }
          .el-button {
            width: 100px;
          }
        }
      }
    }
    &.feedback {
      min-height: 37vh;
      .wrapper {
        display: flex;
        width: 100%;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: 2vh;
        p {
          font-size: 0.95rem;
          margin-right: 3%;
        }
      }
    }
  }
}
.el-message-box {
  width: 320px;
  .el-message-box__btns .el-button--primary {
    background: rgb(71, 204, 237);
    border: rgb(71, 204, 237);
  }
}
</style>