<template>
  <div id="report">
    <div class="item">
      <ul>
        <router-link to="/report/orderReport" tag="li">维修工单</router-link>
        <router-link to="/report/taskReport" tag="li">巡检任务</router-link>
        <router-link to="/report/failureReport" tag="li">故障报表</router-link>
        <router-link to="/report/sensorReport" tag="li">传感器信息记录</router-link>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
<style lang="less">
#report {
  .item {
    height: 86px;
    box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
    background-color: #fefefe;
    padding-left: 30px;
    font-weight: bold;
    line-height: 86px;
    ul {
      li {
        float: left;
        color: #303133;
        font-size: 24px;
        padding: 0 10px;
        border-bottom: none
      }
      .router-link-active {
        color: #7598ea;
        font-size: 28px;
        background-color: #fff;
        border-bottom: 2px solid #7598ea;
      }
    }
  }
}
</style>
