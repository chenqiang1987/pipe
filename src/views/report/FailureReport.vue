<template>
  <div id="failureReport">
    <el-form :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="filter.time"
          type="date"
          :picker-options="pickerOptions"
          placeholder="选择巡检时间"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filter.type" placeholder="请选择任务名称">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="select-group">
        <el-select v-model="filter.type" placeholder="请选择巡检内容">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button icon="el-icon-search"></el-button>
      </el-form-item>
      <el-button class="output-btn" icon="el-icon-download">导出</el-button>
    </el-form>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="工单名称" align="center"></el-table-column>
      <el-table-column prop="content" label="内容" align="center"></el-table-column>
      <el-table-column prop="executor" label="执行人" align="center"></el-table-column>
      <el-table-column prop="expert" label="专家" align="center"></el-table-column>
      <el-table-column prop="errorTime" label="故障发生时间" align="center"></el-table-column>
      <el-table-column prop="okTime" label="恢复时间" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center"></el-table-column>
    </el-table>

    <el-pagination
      class="paging"
      :current-page="filter.pageNum"
      :page-sizes="[10, 20, 30]"
      :page-size="filter.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRows"
      @size-change="onPageSizeChange"
      @current-change="onPageCurrentChange"
    ></el-pagination>

    <el-dialog title="故障添加" :visible.sync="addVisible">
      <el-form :model="addForm">
        <el-form-item label="报警内容">
          <el-input v-model="addForm.name" placeholder="输入故障报警内容" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="巡检时间">
          <el-date-picker
            v-model="value1"
            type="date"
            prefix-icon="el-icon-time"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发现人">
          <el-input v-model="addForm.name" placeholder="选择发现人" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="处理结果">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: {},
      value1: "",
      addVisible: false,
      addForm: [],
      filter: "",
      addForm: [],
      options1: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      options: [
        { value: "1", label: "维护中" },
        { value: "2", label: "维修中" },
        { value: "3", label: "完成" },
      ],
      tableData: [
       
      ],
    };
  },
};
</script>

<style lang="less">
#failureReport {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  .select-group {
    .el-form-item__content {
      .el-input__inner {
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .el-button {
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background-color: rgb(97, 153, 238);
        color: white;
      }
    }
  }

  .output-btn {
    float: right;
    background-color: orange;
    color: white;
  }
  .el-table {
    border-radius: 5px;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);
    .el-table__header {
      width: 100% !important;
    }
    .el-table__body {
      width: 100% !important;
    }
  }
  .el-input {
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  .paging {
    text-align: center;
    margin: 12px 0;
  }
}
</style>
