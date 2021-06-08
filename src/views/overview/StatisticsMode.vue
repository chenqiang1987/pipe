<template>
  <div id="statistics" v-loading="loading">
    <el-row :gutter="7">
      <el-col class="col1" :span="14">
        <el-row class="air">
          <p>
            空气质量传感器
            <br />ug/m3
          </p>
          <el-row class="wrapper">
            <el-col class="pm1" :span="8">
              <div class="container" ref="PM1"></div>
            </el-col>
            <el-col class="pm2-5" :span="8">
              <div class="container" ref="PM2_5"></div>
            </el-col>
            <el-col class="pm10" :span="8">
              <div class="container" ref="PM10"></div>
            </el-col>
          </el-row>
        </el-row>
        <el-row class="gas" :gutter="10">
          <el-col :span="12">
            <p>一氧化碳传感器</p>
            <div class="container" ref="CO"></div>
          </el-col>
          <el-col :span="12">
            <p>甲烷气体传感器</p>
            <div class="container" ref="CH4"></div>
          </el-col>
        </el-row>
      </el-col>

      <el-col class="col2" :span="5">
        <el-row class="oxygen">
          <p>
            氧气浓度传感器
            <br />
            <br />
          </p>
          <div class="container" ref="oxygen"></div>
        </el-row>
        <el-row class="temperature">
          <p>温度传感器</p>
          <div class="container" ref="temperature"></div>
        </el-row>
      </el-col>

      <el-col class="col3" :span="5">
        <el-row class="humidity">
          <p>
            湿度传感器
            <br />
            <br />
          </p>
          <div class="container" ref="humidity"></div>
        </el-row>
        <el-row class="smog">
          <p>烟雾传感器</p>
          <div class="container" ref="smog"></div>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col class="H2S" :span="8">
        <p>硫化氢传感器</p>
        <div class="container" ref="H2S"></div>
      </el-col>
      <!-- <el-col :span="16">
        <p>视觉热成像分析</p>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import echartsLiquidfill from "echarts-liquidfill";
import macarons from "@/assets/js/echartsTheme/macarons.js";
import shine from "@/assets/js/echartsTheme/shine.js";
import infographic from "@/assets/js/echartsTheme/infographic.js";
import roma from "@/assets/js/echartsTheme/roma.js";
import { mapState, mapActions } from "vuex";
import * as types from "@/store/action-types";

export default {
  data() {
    return {
      loading: true,
      // progress: {
      //   num: 80,
      // },
    };
  },
  computed: {
    ...mapState({
      statistic: (state) => state.notification.statistic,
    }),
  },
  methods: {
    drawAirCharts() {
      const pm1Chart = this.$echarts.init(this.$refs.PM1, "macarons");
      const pm2_5Chart = this.$echarts.init(this.$refs.PM2_5, "macarons");
      const pm10Chart = this.$echarts.init(this.$refs.PM10, "macarons");
      const option1 = {
        backgroundColor: "#fff",
        // tooltip: {
        //   formatter: "{a} <br/>{c} {b}",
        // },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        series: [
          {
            name: "PM1",
            type: "gauge",
            detail: {
              fontSize: "18",
              offsetCenter: [0, "-120%"],
            },
            data: [{ name: "PM1" }],
            max: 1000,
            min: 0,
          },
        ],
      };

      const option2 = {
        backgroundColor: "#fff",
        series: [
          {
            name: "PM2.5",
            type: "gauge",
            detail: {
              fontSize: "18",
              offsetCenter: [0, "-120%"],
            },
            data: [{ name: "PM2.5" }],
            max: 1000,
            min: 0,
          },
        ],
      };

      const option3 = {
        series: [
          {
            name: "PM10",
            type: "gauge",
            detail: {
              fontSize: "18",
              offsetCenter: [0, "-120%"],
            },
            data: [{ name: "PM10" }],
            max: 1000,
            min: 0,
          },
        ],
      };

      window.addEventListener("resize", () => {
        pm1Chart.resize();
        pm2_5Chart.resize();
        pm10Chart.resize();
      });

      setInterval(() => {
        // option1.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        // option2.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        // option3.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        option1.series[0].data[0].value = this.statistic.pm1;
        option2.series[0].data[0].value = this.statistic.pm25;
        option3.series[0].data[0].value = this.statistic.pm10;
        pm1Chart.setOption(option1, true);
        pm2_5Chart.setOption(option2, true);
        pm10Chart.setOption(option3, true);
      }, 1000);
    },

    drawCOChart() {
      const COChart = this.$echarts.init(this.$refs.CO, "light");
      const option = {
        backgroundColor: "#fff",
        series: [
          {
            name: "CO",
            type: "gauge",
            detail: {
              fontSize: "14",
              offsetCenter: [0, "65%"],
              formatter: "{value} ppm",
            },
            data: [{ value: 50 }],
            max: 1000,
            min: 0,
            axisLabel: {
              color: "#000",
            },
          },
        ],
      };

      window.addEventListener("resize", () => COChart.resize());

      setInterval(() => {
        // option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        option.series[0].data[0].value = this.statistic.co;
        COChart.setOption(option, true);
      }, 1000);
    },

    drawCH4Chart() {
      const CH4Chart = this.$echarts.init(this.$refs.CH4, "light");
      const option = {
        backgroundColor: "#fff",
        series: [
          {
            name: "CH4",
            type: "gauge",
            detail: {
              fontSize: "14",
              offsetCenter: [0, "65%"],
              formatter: "{value} ppm",
            },
            data: [{ value: 50 }],
            max: 1000,
            min: 0,
            axisLabel: {
              color: "#000",
            },
          },
        ],
      };

      window.addEventListener("resize", () => CH4Chart.resize());

      setInterval(() => {
        option.series[0].data[0].value = this.statistic.methance;
        CH4Chart.setOption(option, true);
      }, 1000);
    },

    drawTemperatureChart() {
      const temperatureChart = this.$echarts.init(
        this.$refs.temperature,
        "infographic"
      );
      const option = {
        backgroundColor: "#fff",
        series: [
          {
            name: "temperature",
            type: "gauge",
            detail: {
              fontSize: "14",
              offsetCenter: [0, "60%"],
              formatter: "{value} ℃",
            },
            data: [{ value: 28 }],
            max: 100,
            min: 0,
            axisLabel: {
              color: "#000",
            },
          },
        ],
      };

      window.onresize = function () {
        temperatureChart.resize();
      };

      setInterval(() => {
        // let sand =
        //   parseInt(option.series[0].data[0].value) +
        //   parseFloat(Math.random().toFixed(1));
        // console.log("temperature :" + this.statistic.temperature)
        option.series[0].data[0].value = this.statistic.temperature;
        temperatureChart.setOption(option, true);
      }, 1000);
    },

    drawHumidityChart() {
      const humidityChart = this.$echarts.init(this.$refs.humidity, "roma");
      const option = {
        backgroundColor: "#fff",
        series: [
          {
            name: "humidity",
            type: "gauge",
            detail: {
              fontSize: "14",
              offsetCenter: [0, "65%"],
              formatter: "{value} %RH",
            },
            data: [{ value: 50 }],
            max: 100,
            min: 0,
            axisLabel: {
              color: "#000",
            },
          },
        ],
      };

      window.addEventListener("resize", () => humidityChart.resize());

      setInterval(() => {
        // option.series[0].data[0].value = (Math.random() * 10).toFixed(2) - 0;
        option.series[0].data[0].value = this.statistic.humidity;
        humidityChart.setOption(option, true);
      }, 1000);
    },

    drawSmogChart() {
      const smogChart = this.$echarts.init(this.$refs.smog, "shine");
      const option = {
        backgroundColor: "#fff",
        series: [
          {
            name: "smog",
            type: "gauge",
            detail: {
              fontSize: "14",
              formatter: "{value} ppm",
            },
            data: [{ value: 50 }],
            max: 1000,
            min: 0,
            axisLabel: {
              color: "#000",
            },
          },
        ],
      };

      window.addEventListener("resize", () => smogChart.resize());

      setInterval(() => {
        // option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        option.series[0].data[0].value = this.statistic.smoke;
        smogChart.setOption(option, true);
      }, 1000);
    },

    drawH2SChart() {
      const H2SChart = this.$echarts.init(this.$refs.H2S, "infographic");
      const option = {
        backgroundColor: "#fff",
        series: [
          {
            name: "H2S",
            type: "gauge",
            detail: {
              fontSize: "14",
              formatter: "{value} ppm",
            },
            data: [{ value: 50 }],
            max: 1000,
            min: 0,
            axisLabel: {
              color: "#000",
            },
          },
        ],
      };

      window.addEventListener("resize", () => H2SChart.resize());

      setInterval(() => {
        option.series[0].data[0].value = this.statistic.hydrothion;
        H2SChart.setOption(option, true);
      }, 1000);
    },

    drawOxygenChart() {
      const oxygenChart = this.$echarts.init(this.$refs.oxygen);
      const option = {
        backgroundColor: "#fff",
        title: {
          left: "center",
          top: "120",
          textStyle: {
            fontWeight: "normal",
            fontSize: 20,
            color: "rgb(0,0,0)",
          },
          subtext: `${this.statistic.oxygen}%`, //副标题
          subtextStyle: {
            fontSize: 30,
            color: "rgb(0,0,0)",
          },
        },

        series: [
          {
            type: "liquidFill", // 图表类型
            radius: "60%",
            center: ["50%", "50%"],
            data: [0, 0, 0], // data个数代表波浪数
            backgroundStyle: {
              borderWidth: 1,
              color: "#F4F9FF",
            },
            label: {
              show: false,
            },
            color: [
              //color一定要是个数组 ，每一项对应一个波浪，可以给每个波浪单独配置颜色
              {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "rgba(255,255,255,1)",
                  },
                  {
                    offset: 0,
                    color: "rgba(103,205,251,1)",
                  },
                ],
                globalCoord: false,
              },
              {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "rgba(187,248,252,0.5)",
                  },
                  {
                    offset: 0,
                    color: "rgba(30,134,245,1)",
                  },
                ],
                globalCoord: false,
              },
              {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "rgba(180,251,255,0.66)",
                  },
                  {
                    offset: 0,
                    color: "rgba(128,122,254,0.66)",
                  },
                ],
                globalCoord: false,
              },
            ],
            outline: {
              show: false,
            },
          },
          //外层线
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["72%", "73%"], //外层线粗细
            hoverAnimation: false,
            data: [
              {
                name: "",
                value: 100,
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: "#67CDFB",
                },
                emphasis: {
                  labelLine: {
                    show: false,
                  },
                  itemStyle: {
                    // color: "#5886f0"
                  },
                },
              },
            ],
          },
          //进度线
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "75%"], //进度线粗细
            hoverAnimation: false,
            data: [
              {
                name: "",
                value: 0, //进度
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 2,
                    colorStops: [
                      // !! 在此添加渐变过程色 !!
                      { offset: 0, color: "#33E2ED" },
                      { offset: 1, color: "#807AFE" },
                    ],
                  },
                },
                emphasis: {
                  labelLine: {
                    show: false,
                  },
                  itemStyle: {
                    // color: "#5886f0"
                  },
                },
              },
              {
                //画剩余的刻度圆环
                name: "",
                value: 100,
                itemStyle: {
                  color: "rgba(0,0,0,0)",
                },
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                emphasis: {
                  labelLine: {
                    show: false,
                  },
                  itemStyle: {
                    color: "#050038",
                  },
                },
              },
            ],
          },
        ],
      };

      window.addEventListener("resize", () => oxygenChart.resize());
      setInterval(() => {
        // console.log(option.series[2].data[0].value)
        option.series[2].data[0].value = this.statistic.oxygen;
        option.series[2].data[1].value = 100 - this.statistic.oxygen;
        option.series[0].data = [
          this.statistic.oxygen,
          this.statistic.oxygen,
          this.statistic.oxygen,
        ];
        option.subtext = this.statistic.oxygen;
        oxygenChart.setOption(option, true);
        // console.log(option.subtext);
      }, 1000);
    },
  },

  mounted() {
    this.drawAirCharts();
    this.drawCOChart();
    this.drawCH4Chart();
    this.drawTemperatureChart();
    this.drawHumidityChart();
    this.drawSmogChart();
    this.drawH2SChart();
    this.drawOxygenChart();
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
};
</script>

<style lang="less">
#statistics {
  height: 100%;
  min-height: 1110px;
  p {
    color: darkgrey;
    font-size: 0.8rem;
    background: #fff;
    padding: 10px;
  }

  .container {
    width: 100%;
    height: 288px;
    box-sizing: border-box;
  }

  .col1 {
    .el-row {
      &.air,
      &.gas {
        margin-bottom: 10px;
      }
      .wrapper {
        background: #fff;
        [class^="pm"] {
          p {
            text-align: center;
            color: #000;
            font-size: 1.2rem;
          }
        }
      }
      .el-col {
        border-radius: 3px;
      }
    }
  }

  .col2 {
    .el-row {
      &.oxygen {
        margin-bottom: 10px;
      }
    }
  }

  .col3 {
    .el-row {
      &.humidity {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
