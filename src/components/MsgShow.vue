<template>
  <div class="msg-wrapper">
    <div v-for="(msg, idx) in msgs" :key="msg.type">
      <svg-icon :iconClass="msg.key" :style="msg.style"></svg-icon>
      {{msg.type}}
      <template v-if="msg.type === '空气质量传感器'">
        <div class="air" v-for="(pm, i) in pmValues" :key="i">
          . {{pm.type}}
          <span>{{pm.value}}</span>
        </div>
      </template>
      <template v-else>
        <span>{{valueSeries[idx]}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      msgs: {
        air: {
          key: "air",
          type: "空气质量传感器",
          style: {
            color: '#3383fa',
            marginRight: '7px'
          }
        },
        oxygen: {
          key: "oxygen",
          type: "氧气浓度传感器",
          style: {
            color: '#15c382',
            marginRight: '7px'
          }
        },
        humidity: {
          key: "IOTtubiao_huabanfuben",
          type: "湿度传感器",
          style: {
            marginRight: '7px'
          }
        },
        CO: {
          key: "hekriconzhuijiayangqi02",
          type: "一氧化碳传感器",
          style: {
            color: 'orange',
            marginRight: '7px'
          }
        },
        CH4: {
          key: "jiawan",
          type: "甲烷气体传感器",
          style: {
            color: '#0ab0d9',
            fontSize: '1.2rem', 
          }
        },
        temperature: {
          key: "wendu",
          type: "温度传感器",
          style: {
            color: 'red',
            marginRight: '7px'
          }
        },
        smog: {
          key: "yanwuganyingqi",
          type: "烟雾传感器",
          style: {
            color: '#d71717',
            marginRight: '7px'
          }
        },
        H2S: {
          key: "liuhuaqing",
          type: "硫化氢传感器",
          style: {
            color: '#7ce7dd',
            marginRight: '7px'
          }
        },
      },
    };
  },
  computed: {
    ...mapState({
      statistic: (state) => state.notification.statistic,
    }),
    pmValues() {
      let pms = [
        {
          type: 'pm1',
          value: `${this.statistic.pm1}（ug/m3)`
        },
        {
          type: 'pm2.5',
          value: `${this.statistic.pm25}（ug/m3)`
        },
        {
          type: 'pm10',
          value: `${this.statistic.pm10}（ug/m3)`
        }
      ]
      return pms
    },
    valueSeries() {
      return {
        oxygen: `${this.statistic.oxygen} %`,
        humidity: `${this.statistic.humidity} %RH`,
        CO: `${this.statistic.co} ppm`,
        CH4: `${this.statistic.methance} ppm`,
        temperature: `${this.statistic.temperature} ℃`,
        smog: `${this.statistic.smoke} ppm`,
        H2S: `${this.statistic.hydrothion} ppm`,
      }
    }
  },
};
</script>

<style lang="less">
.msg-wrapper {
  padding: 0 35px;
  margin-top: -10px;
  line-height: 40px;
  span {
    float: right;
  }
  .air {
    margin-left: 30px;
  }
}
.warning-type {
  margin-bottom: 30px;
  p {
    margin-bottom: 15px;
  }
}
</style>