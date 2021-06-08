<template>
  <div id="warning">
    <el-form
      class="warningForm"
      ref="warningForm"
      :rules="warningFormRules"
      :model="warningForm"
      label-width="50px"
    >
      <div class="warning-type">
        <p>空气质量传感器（ug/m3）</p>
        <el-row :gutter="2" style="margin-bottom: 15px">
          <el-col :span="8">
            <el-form-item label="PM1" prop="pm1_max">
              <el-input size="mini" placeholder="输入最大值" v-model.number="warningForm.pm1_max"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="PM2.5" prop="pm25_max">
              <el-input size="mini" placeholder="输入最大值" v-model.number="warningForm.pm25_max"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="PM10" prop="pm10_max">
              <el-input size="mini" placeholder="输入最大值" v-model.number="warningForm.pm10_max"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="8">
            <el-form-item label="PM1" prop="pm1_min">
              <el-input size="mini" placeholder="输入最小值" v-model.number="warningForm.pm1_min"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="PM2.5" prop="pm25_min">
              <el-input size="mini" placeholder="输入最小值" v-model.number="warningForm.pm25_min"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="PM10" prop="pm10_min">
              <el-input size="mini" placeholder="输入最小值" v-model.number="warningForm.pm10_min"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="warning-type">
        <p>一氧化碳传感器</p>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="最大值" prop="CO_max">
              <el-input size="mini" placeholder="" v-model.number="warningForm.CO_max">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="CO_min">
              <el-input size="mini" placeholder="" v-model.number="warningForm.CO_min">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="warning-type">
        <p>氧气浓度传感器</p>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="最大值" prop="oxygen_max">
              <el-input size="mini" placeholder="" v-model.number="warningForm.oxygen_max">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="oxygen_min">
              <el-input size="mini" placeholder="" v-model.number="warningForm.oxygen_min">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="warning-type">
        <p>湿度传感器</p>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="最大值" prop="humidity_max">
              <el-input size="mini" placeholder="" v-model.number="warningForm.humidity_max">
                <template slot="append">%RH</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="humidity_min">
              <el-input size="mini" placeholder="" v-model.number="warningForm.humidity_min">
                <template slot="append">%RH</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="warning-type">
        <p>甲烷气体传感器</p>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="最大值" prop="CH4_max">
              <el-input size="mini" placeholder="" v-model.number="warningForm.CH4_max">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="CH4_min">
              <el-input size="mini" placeholder="" v-model.number="warningForm.CH4_min">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="warning-type">
        <p>温度传感器</p>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="最大值" prop="temperature_max">
              <el-input size="mini" placeholder="" v-model.number="warningForm.temperature_max">
                <template slot="append">℃</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="temperature_min">
              <el-input size="mini" placeholder="" v-model.number="warningForm.temperature_min">
                <template slot="append">℃</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="warning-type">
        <p>烟雾传感器</p>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="最大值" prop="smog_max">
              <el-input size="mini" placeholder="" v-model.number="warningForm.smog_max">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="smog_min">
              <el-input size="mini" placeholder="" v-model.number="warningForm.smog_min">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="warning-type">
        <p>硫化氢传感器</p>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="最大值" prop="H2S_max">
              <el-input size="mini" placeholder="" v-model.number="warningForm.H2S_max">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值" prop="H2S_min">
              <el-input size="mini" placeholder="" v-model.number="warningForm.H2S_min">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-button
        class="confirm-btn deliver"
        size="small"
        @click="setSensorVal"
        style="margin: 0 0 20px 0"
      >确定</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "../store/action-types";

export default {
  data() {
    return {
      warningForm: {
        pm1_min: "",
        pm1_max: "",
        pm25_min: "",
        pm25_max: "",
        pm10_min: "",
        pm10_max: "",
        CO_min: "",
        CO_max: "",
        oxygen_min: "",
        oxygen_max: "",
        humidity_min: "",
        humidity_max: "",
        temperature_min: "",
        temperature_max: "",
        smog_min: "",
        smog_max: "",
        CH4_min: "",
        CH4_max: "",
        H2S_min: "",
        H2S_max: "",
      },
      warningFormRules: {
        pm1_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        pm1_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        pm25_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        pm25_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        pm10_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        pm10_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        CO_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        CO_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        oxygen_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        oxygen_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        humidity_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        humidity_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        temperature_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        temperature_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        smog_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        smog_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        CH4_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        CH4_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
        H2S_min: [
          {
            required: true,
            type: "number",
            message: "请输入最小值",
            trigger: ["change", "blur"],
          },
        ],
        H2S_max: [
          {
            required: true,
            type: "number",
            message: "请输入最大值",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      curRobot: (state) => state.machine.curRobot,
      cur_machine_sensor_value: (state) =>
        state.sensor.cur_machine_sensor_value,
    }),
  },
  methods: {
    ...mapMutations({
      [types.CUR_MACHINE_SENSOR_VALUE]: `sensor/${[
        types.CUR_MACHINE_SENSOR_VALUE,
      ]}`,
    }),
    ...mapActions({
      [types.GET_SENSOR_FROM_MACHINE]: `sensor/${[
        types.GET_SENSOR_FROM_MACHINE,
      ]}`,
      [types.SET_SENSOR_VALUE]: `sensor/${[types.SET_SENSOR_VALUE]}`,
    }),
    setSensorVal() {
      let params = {
        machineId: this.curRobot.id,
        co: `${this.warningForm.CO_max},${this.warningForm.CO_min}`,
        humidity: `${this.warningForm.humidity_max},${this.warningForm.humidity_min}`,
        hydrothion: `${this.warningForm.H2S_max},${this.warningForm.H2S_min}`,
        methance: `${this.warningForm.CH4_max},${this.warningForm.CH4_min}`,
        oxygen: `${this.warningForm.oxygen_max},${this.warningForm.oxygen_min}`,
        pm1: `${this.warningForm.pm1_max},${this.warningForm.pm1_min}`,
        pm10: `${this.warningForm.pm10_max},${this.warningForm.pm10_min}`,
        pm25: `${this.warningForm.pm25_max},${this.warningForm.pm25_min}`,
        smoke: `${this.warningForm.smog_max},${this.warningForm.smog_min}`,
        temperature: `${this.warningForm.temperature_max},${this.warningForm.temperature_min}`,
      };
      this[[types.SET_SENSOR_VALUE]](params).then(() => {
          this.$message.success("设置成功！");
          this.$emit('close')
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  watch: {
    cur_machine_sensor_value: {
      handler(val, oldVal) {
        this.warningForm = val
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
&.warningForm {
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__label {
      font-size: 0.75rem;
      padding: 0 3px 0 0;
    }
    .el-form-item__content .el-input-group {
      vertical-align: baseline;
      .el-input-group__append,
      .el-input-group__prepend {
        vertical-align: baseline;
      }
    }
    .el-input {
      font-size: 0.5rem;
      .el-input__inner {
        text-align: center;
        padding: 0 5px;
      }
    }
  }
}
</style>