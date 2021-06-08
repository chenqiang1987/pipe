<template>
  <div id="overview">
    <el-radio-group v-model="modeRadio" fill="#47cced" @change="changeMode">
      <el-radio-button label="地图模式"></el-radio-button>
      <el-radio-button label="巡检情况"></el-radio-button>
    </el-radio-group>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modeRadio: "地图模式",
    };
  },
  created() {
      let curRouteName = this.$route.name;
      if (curRouteName === "MapMode") {
        this.modeRadio = "地图模式";
      } else if (curRouteName === "StatisticsMode") {
        this.modeRadio = "巡检情况";
      }
  },
  methods: {
    changeMode(e) {
      if (e === "地图模式") {
        this.$router.push({ path: "/overview/mapMode" });
      } else {
        this.$router.push({ path: "/overview/statisticsMode" });
      }
    },
  },
};
</script>

<style lang="less">
#overview {
  padding: 20px;
  height: 100%;
  .el-radio-group {
    margin-bottom: 20px;
  }
}
</style>
