<template>
  <div id="account">
    <div class="item">
      <ul>
        <li>账户管理</li>
      </ul>
    </div>
    <div class="content">
      <el-row class="search" :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="keywords"
            placeholder="请输入用户名或手机号"
            prefix-icon="el-icon-user"
            @keyup.enter.native="query"
          >
            <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" class="btn">
          <el-button icon="el-icon-plus" @click="addVisible = true;">添加</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userlist.data"
        stripe
        style="width: 100vw"
        max-height="620"
        @filter-change="filterByRole"
      >
        <el-table-column
          prop="role"
          label="权限"
          align="center"
          :filters="roleTags"
          :filter-multiple="false"
          filter-placement="bottom-end"
          column-key="role"
        ></el-table-column>
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column min-width="120" prop="telPhone" label="手机号" align="center"></el-table-column>
        <el-table-column min-width="100" prop="createTime" label="注册时间" align="center"></el-table-column>
        <el-table-column prop="enable" label="状态" align="center"></el-table-column>
        <el-table-column width="260px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.roles[0].name === 'expert' || scope.row.roles[0].name === 'opt'"
              size="mini"
              plain
              type="info"
              @click="onAssignShow(scope.row)"
            >配置专长</el-button>
            <el-button size="mini" plain type="primary" @click="onEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
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
        title="添加用户"
        :visible.sync="addVisible"
        center
        @close="resetForm('addForm')"
        :close-on-click-modal="false"
      >
        <el-form :model="addForm" ref="addForm" :rules="addRules" label-width="80px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="addForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="addForm.confirmPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="nickName">
            <el-input v-model="addForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="telPhone">
            <el-input v-model="addForm.telPhone"></el-input>
          </el-form-item>
          <el-form-item label="用户权限" prop="roleIds">
            <el-select v-model="addForm.roleIds" placeholder="请选择用户权限">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.nickName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="编辑用户"
        :visible.sync="editVisible"
        center
        @close="resetForm('editForm')"
        :close-on-click-modal="false"
      >
        <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="80px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="editForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="nickName">
            <el-input v-model="editForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="telPhone">
            <el-input v-model="editForm.telPhone"></el-input>
          </el-form-item>
          <el-form-item label="用户权限" prop="roleIds">
            <el-select v-model="editForm.roleIds" placeholder="请选择用户权限">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.nickName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="配置专长"
        :visible.sync="assignVisible"
        center
        @close="selectedMetierList = []"
        :close-on-click-modal="false"
      >
        <el-transfer
          v-model="selectedMetierList"
          :titles="['专长列表', '已分配']"
          :props="{
            key: 'code',
            label: 'name'
          }"
          :data="faultList"
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
import { removeSession } from "@/utils/local";
import { deepClone } from "@/utils/deepClone";
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "../store/action-types";

export default {
  data() {
    let checkPassword1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码必填"));
      } else {
        if (this.addForm.confirmPassword !== "") {
          this.$refs.addForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    let checkPassword2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请再次输入密码"));
      } else if (value !== this.addForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      addVisible: false,
      editVisible: false,
      delVisible: false,
      assignVisible: false,
      addForm: {
        userName: "",
        nickName: "",
        password: "",
        confirmPassword: "",
        telPhone: "",
        roleIds: "",
      },
      editForm: {
        id: "",
        userName: "",
        nickName: "",
        telPhone: "",
        roleIds: "",
      },
      addRules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"],
          },
        ],
        password: [
          {
            required: true,
            validator: checkPassword1,
            trigger: ["change", "blur"],
          },
        ],
        confirmPassword: [
          {
            required: true,
            validator: checkPassword2,
            trigger: ["change", "blur"],
          },
        ],
        roleIds: [
          {
            required: true,
            message: "请选择权限类型",
            trigger: ["change", "blur"],
          },
        ],
      },
      editRules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"],
          },
        ],
        proleIds: [
          {
            required: true,
            message: "请选择权限类型",
            trigger: ["change", "blur"],
          },
        ],
      },
      filter: {
        pageNum: 1,
        pageSize: 10,
      },
      keywords: "",
      selectedMetierList: [],
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.role.roles,
      userlist: (state) => state.account.userlist,
      faultList: (state) => state.maintain.faultList,
      userMetier: (state) => state.account.userMetier,
    }),
    totalRows() {
      return this.userlist.total;
    },
    roleTags() {
      return this.roles.map((v) => {
        v.text = v.nickName;
        v.value = v.id;
        return v;
      });
    },
  },
  async created() {
    this[types.GET_ALL_USERS](this.filter);
  },
  methods: {
    ...mapActions({
      [types.GET_ALL_USERS]: `account/${[types.GET_ALL_USERS]}`,
      [types.ADD_OR_MODIFY_ONE_USER]: `account/${[
        types.ADD_OR_MODIFY_ONE_USER,
      ]}`,
      [types.DEL_ONE_USER]: `account/${[types.DEL_ONE_USER]}`,
      [types.GET_USER_METIER]: `account/${[types.GET_USER_METIER]}`,
      [types.SET_METIER_FOR_USER]: `account/${[types.SET_METIER_FOR_USER]}`,
    }),
    ...mapMutations({
      [types.SET_USER_METIER]: `account/${[types.SET_USER_METIER]}`,
    }),
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    filterByRole(filters) {
      let roleId = filters.role;
      if (roleId.length === 0) {
        roleId = "";
      } else roleId = roleId[0];
      const filter = {
        pageNum: 1,
        pageSize: this.filter.pageSize,
        roleId: roleId,
      };
      console.log(filter);
      this[types.GET_ALL_USERS](filter);
    },
    onPageSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.filter.pageSize = val;
      this[types.GET_ALL_USERS](this.filter);
    },
    onPageCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.filter.pageNum = val;
      this[types.GET_ALL_USERS](this.filter);
    },
    handleAdd() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          try {
            let params = deepClone(this.addForm);
            params.roleIds = [this.addForm.roleIds];
            this[types.ADD_OR_MODIFY_ONE_USER](params)
              .then(() => {
                this.$message.success("添加成功!");
                this.addVisible = false;
                this[types.GET_ALL_USERS](this.filter);
                this.resetForm("addForm");
              })
              .catch(() => {
                this.$message.error("添加失败!");
              });
          } catch (e) {
            this.$message.error(e);
          }
        } else {
          return false;
        }
      });
    },
    onEdit(row) {
      this.editVisible = true;
      this.editForm = {
        id: row.id,
        userName: row.userName,
        nickName: row.nickName,
        telPhone: row.telPhone,
        roleIds: row.roles[0].id,
      };
    },
    handleEdit() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          try {
            let params = deepClone(this.editForm);
            params.roleIds = [this.editForm.roleIds];
            this[types.ADD_OR_MODIFY_ONE_USER](params)
              .then(() => {
                this.$message.success("编辑成功!");
                this.editVisible = false;
                this[types.GET_ALL_USERS](this.filter);
                this.resetForm("editForm");
              })
              .catch(() => {
                this.$message.error("编辑失败!");
              });
          } catch (e) {
            this.$message.error(e);
          }
        } else {
          return false;
        }
      });
    },
    handleDelete(row) {
      this.$confirm(
        "此操作将删除角色\n" + row.nickName + ", 是否继续?",
        "提示",
        {
          type: "warning",
        }
      )
        .then(() => {
          this[types.DEL_ONE_USER](row.id)
            .then(() => {
              this.$message.success("成功删除了角色\n" + row.nickName + "!");
              this[types.GET_ALL_USERS](this.filter);
            })
            .catch(() => {
              this.$message.error("删除失败!");
            });
        })
        .catch((e) => {
          console.log(e);
          this.$message.info("已取消操作!");
        });
    },
    async onAssignShow(row) {
      await this[types.GET_USER_METIER](row.id).catch((e) => {
        if (e.code === 504) {
          this.selectedMetierList = [];
        }
      });
      this.userMetier.forEach((v) => {
        this.faultList.forEach((f) => {
          if (f.name === v) {
            this.selectedMetierList.push(f.code);
          }
        });
      });
      this.assignVisible = true;
      this.curRowId = row.id;
    },
    assignPermission() {
      let params = {
        userId: this.curRowId,
        faults: this.selectedMetierList.join("%2C"),
      };
      this[types.SET_METIER_FOR_USER](params)
        .then((data) => {
          this.$message.success("配置成功");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.msg);
        })
        .finally(() => {
          this.assignVisible = false;
          this.selectedMetierList = [];
        });
    },
    query() {
      if (!this.keywords) {
        this.$message.error("请输入查询条件！");
        return;
      }
      let params = {
        telPhone: this.keywords,
        userName: this.keywords,
      };
      this[types.GET_ALL_USERS](params)
        .then(() => {
          this.$message.success("查询成功");
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
  },
};
</script>

<style lang="less">
#account {
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
      width: 35vw;
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
          .el-select {
            width: 100%;
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
