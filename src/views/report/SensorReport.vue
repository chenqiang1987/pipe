<template>
  <div id="sensorReport">
    <el-row>
      <el-form :inline="true" style="float: right">
        <el-form-item>
          <el-select v-model="cSensor" placeholder="请选择传感器">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="pickTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-button size="medium" class="gen-btn" @click="genDetails">生成列表</el-button>
      </el-form>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="container" ref="PM"></div>
      </el-col>
      <el-col :span="8">
        <div class="container" ref="oxygen"></div>
      </el-col>
      <el-col :span="8">
        <div class="container" ref="humidity"></div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="container" ref="CO"></div>
      </el-col>
      <el-col :span="8">
        <div class="container" ref="CH4"></div>
      </el-col>
      <el-col :span="8">
        <div class="container" ref="temperature"></div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="container" ref="smog"></div>
      </el-col>
      <el-col :span="8">
        <div class="container" ref="H2S"></div>
      </el-col>
      <el-col :span="8">
        <div class="container"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "@/store/action-types";

export default {
  data() {
    return {
      gapList: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      pickTime: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      options: [
        {
          label: "pm1",
          value: "pm1",
        },
        {
          label: "pm2.5",
          value: "pm25",
        },
        {
          label: "pm10",
          value: "pm10",
        },
        {
          label: "氧气浓度传感器",
          value: "oxygen",
        },
        {
          label: "湿度传感器",
          value: "humidity",
        },
        {
          label: "一氧化碳传感器",
          value: "co",
        },
        {
          label: "甲烷气体传感器",
          value: "methance",
        },
        {
          label: "温度传感器",
          value: "temperature",
        },
        {
          label: "烟雾传感器",
          value: "smoke",
        },
        {
          label: "硫化氢传感器",
          value: "hydrothion",
        },
      ],
      cSensor: "",
    };
  },
  computed: {
    ...mapState({
      curve_graph: (state) => state.sensor.curve_graph,
    }),
  },
  methods: {
    ...mapActions({
      [types.GET_CURVE_GRAPH]: `sensor/${[types.GET_CURVE_GRAPH]}`,
    }),
    genDetails() {
      const params = {
        machineId: 1, // 暂时只有一个机器人
        start: this.pickTime[0],
        end: this.pickTime[1],
      };
      this[types.GET_CURVE_GRAPH](params)
        .then((res) => {
          let hasVal = Object.values(res).every((v) => v.length !== 0);
          if (!hasVal) {
            this.$message.error("未查询到数据");
            return;
          }
          this.$router.push("/report/sensorReport/details");
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },
    drawPMCharts() {
      const pmChart = this.$echarts.init(this.$refs.PM, "light");
      window.addEventListener("resize", () => pmChart.resize());
      pmChart.setOption({
        title: {
          text: "空气质量传感器",
          subtext: "1ug/m3",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          right: "20px",
          icon: "circle",
          data: ["PM1", "PM2.5", "PM10"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "PM1",
            symbol: "none",
            type: "line",
            color: "#3dc497",
            smooth: true,
            data: [
              120,
              132,
              101,
              134,
              90,
              230,
              210,
              245,
              105,
              60,
              56,
              70,
              90,
              123,
              100,
              105,
            ],
          },
          {
            name: "PM2.5",
            symbol: "none",
            type: "line",
            color: "#fbc755",
            smooth: true,
            data: [
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              101,
              134,
              90,
              120,
              132,
              101,
              134,
              90,
              230,
            ],
          },
          {
            name: "PM10",
            symbol: "none",
            type: "line",
            color: "#ce70ce",
            smooth: true,
            data: [
              150,
              232,
              201,
              154,
              190,
              330,
              410,
              182,
              191,
              234,
              120,
              132,
              101,
              134,
              90,
              230,
            ],
          },
        ],
      });
    },
    drawOxygenChart() {
      const oxygenChart = this.$echarts.init(this.$refs.oxygen, "light");
      window.addEventListener("resize", () => oxygenChart.resize());
      oxygenChart.setOption({
        title: {
          text: "氧气浓度传感器",
          subtext: "%",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        color: "#ab68f1",
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "oxygen",
            symbol: "none",
            type: "line",
            smooth: true,
            data: [
              221,
              345,
              612,
              600,
              401,
              415,
              777,
              854,
              732,
              502,
              512,
              734,
              972,
              888,
              793,
            ],
          },
        ],
      });
    },
    drawHumidityChart() {
      const humidityChart = this.$echarts.init(this.$refs.humidity, "light");
      window.addEventListener("resize", () => humidityChart.resize());
      humidityChart.setOption({
        title: {
          text: "湿度传感器",
          subtext: "%RH",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        color: "#2daaad",
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "humidity",
            symbol: "none",
            type: "line",
            smooth: true,
            data: [
              221,
              345,
              612,
              600,
              401,
              415,
              777,
              854,
              732,
              502,
              512,
              734,
              972,
              888,
              793,
            ],
          },
        ],
      });
    },
    drawCOChart() {
      const COChart = this.$echarts.init(this.$refs.CO, "light");
      window.addEventListener("resize", () => COChart.resize());
      COChart.setOption({
        title: {
          text: "一氧化碳传感器",
          subtext: "ppm",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        color: "#5962ff",
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "CO",
            symbol: "none",
            type: "line",
            smooth: true,
            data: [
              221,
              345,
              612,
              600,
              401,
              415,
              777,
              854,
              732,
              502,
              512,
              734,
              972,
              888,
              793,
            ],
          },
        ],
      });
    },
    drawCH4Chart() {
      const CH4Chart = this.$echarts.init(this.$refs.CH4, "light");
      window.addEventListener("resize", () => CH4Chart.resize());
      CH4Chart.setOption({
        title: {
          text: "甲烷气体传感器",
          subtext: "ppm",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        color: "#ff950b",
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "CH4",
            symbol: "none",
            type: "line",
            smooth: true,
            data: [
              221,
              345,
              612,
              600,
              401,
              415,
              777,
              854,
              732,
              502,
              512,
              734,
              972,
              888,
              793,
            ],
          },
        ],
      });
    },
    drawTemperatureChart() {
      const temperatureChart = this.$echarts.init(
        this.$refs.temperature,
        "light"
      );
      window.addEventListener("resize", () => temperatureChart.resize());
      temperatureChart.setOption({
        title: {
          text: "温度传感器",
          subtext: "℃",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "temperature",
            symbol: "none",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    // 右， 下， 左， 上
                    {
                      offset: 0,
                      color: "#2b7ae9",
                    },
                    {
                      offset: 1,
                      color: "#c997fd",
                    },
                  ]), // 线条渐变色
                },
              },
            },
            data: [
              221,
              345,
              612,
              600,
              401,
              415,
              777,
              854,
              732,
              502,
              512,
              734,
              972,
              888,
              793,
            ],
          },
        ],
      });
    },

    drawSmogChart() {
      const smogChart = this.$echarts.init(this.$refs.smog, "light");
      window.addEventListener("resize", () => smogChart.resize());
      smogChart.setOption({
        title: {
          text: "烟雾传感器",
          subtext: "ppm",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        color: "#7bb0ff",
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "smog",
            symbol: "none",
            type: "line",
            smooth: true,
            data: [
              221,
              345,
              612,
              600,
              401,
              415,
              777,
              854,
              732,
              502,
              512,
              734,
              972,
              888,
              793,
            ],
          },
        ],
      });
    },
    drawH2SChart() {
      const H2SChart = this.$echarts.init(this.$refs.H2S, "light");
      window.addEventListener("resize", () => H2SChart.resize());
      H2SChart.setOption({
        title: {
          text: "硫化氢传感器",
          subtext: "ppm",
          textStyle: {
            color: "#606266",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        color: "#50c466",
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.gapList,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#f6f6f6",
            },
          },
        },
        series: [
          {
            name: "H2S",
            symbol: "none",
            type: "line",
            smooth: true,
            data: [
              221,
              345,
              612,
              600,
              401,
              415,
              777,
              854,
              732,
              502,
              512,
              734,
              972,
              888,
              793,
            ],
          },
        ],
      });
    },
  },
  mounted() {
    this.drawPMCharts();
    this.drawOxygenChart();
    this.drawHumidityChart();
    this.drawCOChart();
    this.drawCH4Chart();
    this.drawTemperatureChart();
    this.drawSmogChart();
    this.drawH2SChart();
  },
};
</script>

<style lang="less">
#sensorReport {
  height: 100vh;
  min-height: 1025px;
  padding: 20px;
  .container {
    height: 288px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
  }
  .gen-btn {
    background-color: orange;
    color: white;
  }
}
</style>
