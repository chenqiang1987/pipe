<template>
  <div id="role">
    <div class="item">
      <ul>
        <li>角色权限管理</li>
      </ul>
    </div>
    <div class="content">
      <el-row class="search" :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入代码或名称" class="input-with-select" v-model="keywords">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" class="btn">
          <el-button icon="el-icon-plus" @click="addVisible = true">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="roles" stripe style="width: 100vw" max-height="620">
        <el-table-column prop="name" label="代码" align="center"></el-table-column>
        <el-table-column prop="nickName" label="名称" align="center"></el-table-column>
        <el-table-column prop="enable" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" class="btn-group">
            <!-- <el-button size="mini" plain type="primary" @click="handleEdit(scope.row)">编辑</el-button> -->
            <el-button size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="mini" plain type="info" @click="onAssignShow(scope.row)">配置权限</el-button>
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
        title="添加角色"
        :visible.sync="addVisible"
        center
        @close="resetForm('addForm')"
        :close-on-click-modal="false"
      >
        <el-form :model="addForm" ref="addForm" :rules="addRules" label-width="80px">
          <el-form-item label="代码" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="nickName">
            <el-input v-model="addForm.nickName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="配置权限"
        :visible.sync="assignVisible"
        center
        @close="selectedPermitsIdx = [3]"
        :close-on-click-modal="false"
      >
        <el-transfer
          v-model="selectedPermitsIdx"
          :titles="['权限列表', '已分配']"
          :props="{
            key: 'id',
            label: 'name'
          }"
          :data="permitlist"
        ></el-transfer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assignVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignPermission">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "../store/action-types";

export default {
  data() {
    return {
      addVisible: false,
      assignVisible: false,
      addForm: {
        name: "",
        nickName: "",
      },
      addRules: {
        name: [
          {
            required: true,
            message: "请输入权限代码",
            trigger: ["change", "blur"],
          },
        ],
        nickName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: ["change", "blur"],
          },
        ],
      },
      filter: {
        pageNum: 1,
        pageSize: 10,
      },
      selectedPermitsIdx: [3],
      curRowId: "",
      keywords: "",
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.role.roles,
      permitlist: (state) => state.permit.permitlist,
      selectedPermits: (state) => state.permit.selectedPermits,
    }),
    totalRows() {
      return this.roles.length;
    },
  },
  created() {},
  methods: {
    ...mapMutations({
      [types.SET_ALL_ROLES]: `role/${[types.SET_ALL_ROLES]}`,
    }),
    ...mapActions({
      [types.GET_ALL_ROLES]: `role/${[types.GET_ALL_ROLES]}`,
      [types.ADD_ONE_ROLE]: `role/${[types.ADD_ONE_ROLE]}`,
      [types.DEL_ONE_ROLE]: `role/${[types.DEL_ONE_ROLE]}`,
      [types.GET_ALL_PERMITS]: `permit/${[types.GET_ALL_PERMITS]}`,
      [types.SET_ROLE_PERMIT]: `permit/${[types.SET_ROLE_PERMIT]}`,
      [types.GET_ROLE_PERMIT]: `permit/${[types.GET_ROLE_PERMIT]}`,
    }),
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onPageSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.filter.pageSize = val;
      this[types.GET_ALL_ROLES]();
    },
    onPageCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.filter.pageNum = val;
      this[types.GET_ALL_ROLES]();
    },
    async onAssignShow(row) {
      const promises = [
        this[types.GET_ALL_PERMITS](),
        this[types.GET_ROLE_PERMIT](row.id),
      ];
      await Promise.all(promises);
      this.selectedPermits.forEach((v) => {
        this.selectedPermitsIdx.push(v.id);
      });
      this.assignVisible = true;
      this.curRowId = row.id;
    },
    handleDelete(row) {
      this.$confirm("此操作将删除角色\n" + row.name + ", 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          let rowId = row.id;
          this[types.DEL_ONE_ROLE](rowId)
            .then(() => {
              this.$message.success("成功删除了角色\n" + row.nickName + "!");
              this[types.GET_ALL_ROLES]();
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
      try {
        this[types.ADD_ONE_ROLE](this.addForm)
          .then(() => {
            this.$message.success("添加成功!");
            this.addVisible = false;
            this[types.GET_ALL_ROLES]();
            this.resetForm("addForm");
          })
          .catch((err) => {
            this.$message.error("添加失败!");
          });
      } catch (e) {
        this.$message.error(e);
      }
    },
    async search() {
      await this[types.GET_ALL_ROLES]();
      let filterRoles = this.roles.filter(
        (item) => item.name === this.keywords || item.nickName === this.keywords
      );
      this[types.SET_ALL_ROLES](filterRoles);
    },
    assignPermission() {
      console.log(this.selectedPermitsIdx)
      let params = {
        roleId: this.curRowId,
        ids: this.selectedPermitsIdx.join("%2C"),
      };
      this[types.SET_ROLE_PERMIT](params)
        .then((data) => {
          this.$message.success("配置成功");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.msg);
        })
        .finally(() => {
          this.assignVisible = false;
          this.selectedPermitsIdx = [3];
        });
    },
  },
};
</script>

<style lang="less">
#role {
  .btn {
    padding-left: 20px !important;
    .el-button {
      background-color: #7598ea;
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
        margin-left: -26px;
      }
      .el-input-group__append {
        background-color: #7598ea;
        color: white;
      }
    }
    .el-dialog {
      width: 40%;
      .el-dialog__body {
        text-align: center;
        padding: 25px 25px 30px;
        .el-transfer-panel__header,
        .el-transfer-panel__list {
          text-align: initial;
        }
      }
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
