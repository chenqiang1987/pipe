<template>
  <div id="orderReport">
    <el-form :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="filter.time"
          type="date"
          :picker-options="pickerOptions"
          placeholder="选择故障发生时间"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="select-group">
        <el-select v-model="filter.type" placeholder="请选择工单名称">
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

    <el-dialog title="维修工单添加" :visible.sync="addVisible">
      <el-form :model="addForm">
        <div class="addDialogLeft fl">
          <el-form-item label="工单名称">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="协助专家">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="发生时间">
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
          <el-form-item label="恢复时间">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
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
      addForm: [],
      options1: [],
      filter: {},
      tableData: [
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
        // {
        //   name: "电力线路",
        //   content: "局部温度异常",
        //   executor: "李文达",
        //   expert: "合理",
        //   errorTime: "2020/03/12",
        //   okTime: "2020/03/16",
        //   status: "维护中",
        // },
      ],
    };
  },
};
</script>

<style lang="less">
#orderReport {
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
    .el-button {
      font-size: 25px;
      width: 60px;
      box-sizing: border-box;
      margin-left: -26px;
    }
    .el-input-group__append {
      background-color: #7598ea;
      color: white;
    }
  }
  .paging {
    text-align: center;
    margin: 12px 0;
  }
}
</style>
