<template>
  <div id="taskReport">
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
      <el-table-column prop="name" label="任务类型" align="center"></el-table-column>
      <el-table-column prop="executor" label="创建人" align="center"></el-table-column>
      <el-table-column prop="executor" label="机器人" align="center"></el-table-column>
      <el-table-column prop="content" label="巡检内容" align="center"></el-table-column>
      <el-table-column prop="start" label="巡检时间" align="center"></el-table-column>
      <el-table-column prop="content" label="巡检结果" align="center"></el-table-column>
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

    <!-- 添加的dialog -->
    <el-dialog title="维修工单添加" :visible.sync="addVisible">
      <el-form :model="addForm">
        <div class="addDialogLeft fl">
          <el-form-item label="工单名称">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="协助专家">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="巡检结果">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="巡检时间">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="addDialogRight fl">
          <el-form-item label="执行人">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </div>
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
      addVisible: false,
      filter: "",
      addForm: [],
      options1: [],
      options: [],
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
      tableData: [
       
    };
  },
};
</script>

<style lang="less">
#taskReport {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-form-item {
    margin-bottom: 0;
  }

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
    margin-bottom: 20px;
  }
  .paging {
    text-align: center;
    margin: 12px 0;
  }
}
</style>
