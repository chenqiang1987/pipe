<template>
  <div id="login">
    <div class="bg">
      <div class="user">用户登录</div>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="userName">
          <el-input v-model="form.userName" prefix-icon="el-icon-user" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item2">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            placeholder="输入密码"
            show-password
            @keyup.enter.native="submitForm('form')"
          ></el-input>
        </el-form-item>
        <el-form-item class="item3">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
          <div class="forget">忘记密码?</div>
        </el-form-item>
        <el-form-item>
          <el-button class="loginBtn" @click="submitForm('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getSession } from "@/utils/local";
import { mapState, mapActions } from "vuex";
import * as types from "../store/action-types";

export default {
  data() {
    return {
      form: {
        userName: "",
        password: "",
      },
      checked: false,
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },

  // created() {
  //   let hasPermission = getSession("hasPermission");
  //   if (hasPermission) {
  //     this.$router.push("/home");
  //   }
  // },
  methods: {
    ...mapActions({
      [types.USER_LOGIN]: `account/${[types.USER_LOGIN]}`,
    }),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this[types.USER_LOGIN](this.form)
            .then(() => {
              this.$message.success("登陆成功!");
              this.$router.push("/");
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.msg);
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
#login {
  width: 100%;
  height: 100%;
  background: url("../assets/images/背景.png") center center no-repeat;
  background-size: 100% 100%;
  position: relative;
  .user {
    color: #00e2eb;
    font-size: 28px;
    text-align: center;
    line-height: 110px;
    letter-spacing: 10px;
  }
  .bg {
    width: 671px;
    height: 464px;
    background: url("../assets/images/登录.png") center center no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .el-form-item {
    width: 80%;
    margin: 0 auto;
    margin-bottom: 27px;
  }
  .password {
    color: white;
  }
  .item2 {
    margin-bottom: 0;
  }
  .item3 {
    margin: 10px auto;
    color: white;
  }
  .el-input {
    height: 60px;
    border: 3px solid #05669d;
    box-sizing: border-box;
    font-size: 18px;
  }
  .el-input__inner {
    width: 100%;
    padding-left: 40px;
    height: 100%;
    border-radius: 0;
    border: 0;
    background-color: rgba(4, 69, 107, 0.7);
    color: white;
  }
  .el-input__icon {
    color: #00e2eb;
    font-size: 24px;
  }
  .el-checkbox {
    color: white;
  }
  .loginBtn {
    width: 100%;
    height: 60px;
    background-color: #00e2eb;
    border: none;
    font-size: 24px;
    letter-spacing: 10px;
    border-radius: 0;
  }
  .forget {
    float: right;
  }
}
</style>
