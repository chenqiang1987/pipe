<template>
  <div id="sensorDetails">
    <el-button icon="el-icon-download" class="download-btn">下载</el-button>
    <el-table :data="details" stripe style="width: 100vw" max-height="620">
      <el-table-column prop="type" label="名称" align="center"></el-table-column>
      <el-table-column prop="exeName" label="单位" align="center"></el-table-column>
      <el-table-column prop="content" label="时间" align="center"></el-table-column>
      <el-table-column prop="start" label="数值" align="center"></el-table-column>
      <el-table-column prop="end" label="状态" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSession, removeSession } from '@/utils/local'
export default {
  data() {
    return {
      details: [],
    };
  },
  created() {
    getSession('curveGrap')
  }
};
</script>

<style lang="less">
#sensorDetails {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .download-btn {
    float: right;
    background-color: orange;
    color: white;
    margin-bottom: 20px;
  }
  .el-table {
    border-radius: 5px;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>