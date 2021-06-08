<template>
  <div id="monitor">
    <div class="item">
      <ul>
        <li>机器人管理</li>
      </ul>
    </div>
    <div class="content">
      <el-row class="search" :gutter="20">
        <el-col :span="5">
          <el-input placeholder="输入机器人名称"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="输入所属单位"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入联系方式" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="5" class="btn">
          <el-button icon="el-icon-plus" @click="addVisible = true">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="robots" stripe style="width: 100vw" max-height="620">
        <el-table-column prop="serialNumber" label="机器人编号" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" align="center"></el-table-column>
        <el-table-column prop="owerId" label="所属单位" align="center"></el-table-column>
        <el-table-column prop label="联系方式" align="center"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary">编辑</el-button>
            <el-button size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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

      <el-dialog
        title="添加机器人"
        :visible.sync="addVisible"
        center
        @close="resetForm('addForm')"
        :close-on-click-modal="false"
      >
        <el-form :model="addForm" ref="addForm" :rules="addRules" label-width="60px">
          <el-form-item label="编号" prop="number">
            <el-input v-model="addForm.number"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import * as types from "../store/action-types";

export default {
  data() {
    return {
      addVisible: false,
      addForm: {
        number: "",
        name: "",
      },
      addRules: {
        number: [
          {
            required: true,
            message: "请输入机器人编号",
            trigger: ["change", "blur"],
          },
        ],
        name: [
          {
            required: true,
            message: "请输入机器人名称",
            trigger: ["change", "blur"],
          },
        ],
      },
      filter: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapState({
      robots: (state) => state.machine.robots,
    }),
    totalRows() {
      return this.robots.length;
    },
  },
  async created() {
    this[types.GET_ALL_MACHINES]();
  },
  methods: {
    ...mapActions({
      [types.GET_ALL_MACHINES]: `machine/${[types.GET_ALL_MACHINES]}`,
      [types.ADD_MACHINE]: `machine/${[types.ADD_MACHINE]}`,
    }),
    onPageSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.filter.pageSize = val;
      this.getUserList();
    },
    onPageCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.filter.pageNum = val;
      this.getUserList();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleDelete(row) {
      this.$confirm("此操作将删除角色\n" + row.name + ", 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          let rowId = row.id;
          this[types.DEL_ONE_ROLE]({ id: rowId })
            .then(() => {
              this.$message.success("成功删除了角色\n" + row.nickName + "!");
            })
            .catch(() => {
              this.$message.error("删除失败!");
            });
        })
        .catch(() => {
          this.$message.info("已取消操作!");
        });
    },
    handleAdd() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          try {
            this[types.ADD_MACHINE](this.addForm)
              .then(() => {
                this.$message.success("添加成功!");
                this.addVisible = false;
                this[types.GET_ALL_MACHINES]();
                this.resetForm("addForm");
              })
              .catch(() => {
                this.$message.error("添加失败!");
              });
          } catch (e) {
            console.log(e)
            this.$message.error(e);
          }
        } else {
          return false;
        }
      });
    },
    handEdit() {
      try {
        const { data } = this.$axios.post(
          "/user/authc/addOrModifyOne",
          this.editForm
        );
        if (data.code === 200) {
          this.$message.success("编辑成功!");
          this.editVisible = false;
          this.getUserList();
        } else {
          this.$message.error(data.msg);
        }
      } catch (e) {
        this.$message.error(e);
      }
    },
  },
};
</script>

<style lang="less">
#monitor {
  .btn {
    button {
      float: right;
      background-color: orange;
      color: white;
    }
  }
  .item {
    height: 86px;
    box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
    background-color: #fefefe;
    padding-left: 30px;
    font-weight: bold;
    font-size: 28px;
    line-height: 86px;
    ul {
      li {
        float: left;
        color: #7598ea;
        padding: 0 5px;
        border-bottom: 2px solid #7598ea;
      }
    }
  }
  .content {
    padding: 20px;
    .el-input {
      box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      .el-button {
        font-size: 25px;
        width: 60px;
        box-sizing: border-box;
        // background-color: red;
        margin-left: -26px;
      }
      .el-input-group__append {
        background-color: #7598ea;
        color: white;
      }
    }
    .el-dialog {
      width: 30vw;
      .el-form {
        .el-form-item {
          padding: 0 20px;
          .el-input {
            box-shadow: none;
          }
        }
      }
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
    .paging {
      text-align: center;
      margin: 12px 0;
    }
  }
}
</style>
