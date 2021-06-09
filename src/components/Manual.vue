<template>
   <div class="msg-wrapper">


 

    


           点击【确定待机】让机器人进入原地待机状态,此时机器人可以使用无线遥控手柄控制机器人行走，点击【恢复自动】可以让机器人恢复自动巡检状态。
 
     
   <br>
       <el-button type="primary" size="small" @click="start()" style="margin: 0 0 20px 0; float: right;">恢复自动</el-button>
        <el-button type="primary" size="small" @click="standby()" style="margin: 0 0 20px 0; float: right;">确定待机</el-button>
   

   


  </div>
</template>

<script>
import * as types from "@/store/action-types";
import {  mapActions } from "vuex";
export default {
  data() {
    return {
      form: {},
    };
  },
  methods:{
    ...mapActions({
      [types.MACHINE_STOP]: `machine/${[types.MACHINE_STOP]}`,
      [types.MACHINE_START]: `machine/${[types.MACHINE_START]}`
    }),
    standby(){

      this[types.MACHINE_STOP](1)
        .then((data) => {
        
          console.log(data)
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
      
    },
     start(){

      this[types.MACHINE_START](1)
        .then((data) => {
        
          console.log(data)
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
      
    }
  }
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
