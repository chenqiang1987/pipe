<template>
  <!--  <div
    id="home"
    v-loading="wsLoading"
    element-loading-text="当前网络异常，正在尝试重连..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  > -->
  <div id="home">
    <el-container>
      <el-header height="80px">
        <div>
          <span class="title fl">
            <svg-icon iconClass="robot" style="margin-right: 10px"></svg-icon>机器人系统管理平台
          </span>
        </div>
        <div class="fr">
          <el-badge :value="unreadMsgNum">
            <el-button size="small" @click="assistVisible = true">专家协助</el-button>
          </el-badge>
          <span class="username">{{curUser.userName}}</span>
          <a href="#" @click.prevent="logout" class="logout" style="color: skyblue">退出</a>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </div>
      </el-header>
      <el-container>
        <el-aside width="225px" class="noScrollBar">
          <!-- <ul>
            <template v-for="item in this.$router.options.routes">
              <router-link v-if="!item.hidden" tag="li" to="/overview" :key="item.path">
              <i class="icon el-icon-copy-document"></i>{{item.title}}
            </router-link>
            </template>

          </ul>-->
          <ul>
            <template v-for="route in this.asyncRoutes">
              <router-link tag="li" :to="route.path" :key="route.path">
                <i :class="route.meta.icon"></i>
                {{route.meta.title}}
              </router-link>
            </template>
          </ul>

          <!-- <ul>
            <router-link tag="li" to="/overview">
              <i class="icon el-icon-copy-document"></i>运维总览
            </router-link>
            <router-link tag="li" to="/monitor">
              <i class="icon el-icon-help"></i>机器人监控管理
            </router-link>
            <router-link tag="li" to="/inspecting">
              <i class="icon el-icon-date"></i>巡检任务管理
            </router-link>
            <router-link tag="li" to="/repair">
              <i class="icon el-icon-document"></i>运维工单管理
            </router-link>
            <router-link tag="li" to="/report">
              <i class="icon el-icon-monitor"></i>系统报表
            </router-link>
            <router-link tag="li" to="/expert">
              <i class="icon el-icon-connection"></i>专家协助模式
            </router-link>
            <router-link tag="li" to="/account">
              <i class="icon el-icon-wallet"></i>账户管理
            </router-link>
            <router-link tag="li" to="/role">
              <i class="icon el-icon-setting"></i>角色权限管理
            </router-link>
          </ul>-->
        </el-aside>
        <el-main class="noScrollBar">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="专家协助" :visible.sync="assistVisible" center :close-on-click-modal="false" @open="help">
      <Assist :socketData="chatSocket" ref="assist" />
    </el-dialog>
  </div>
</template>

<script>
  import {
    getSession
  } from "@/utils/local";
  import WS from "@/utils/ws";
  import chatUtils from "@/utils/chatUtils";
  import {
    mapState,
    mapMutations,
    mapActions
  } from "vuex";
  import * as types from "../store/action-types";
  import Assist from "@/components/Assist";
  var wsCloseNotify;
  export default {
    components: {
      Assist,
    },
    data() {
      return {
        curUser: "",
        caller: null,
        chatSocket: "",
        wsLoading: false,
        asyncRoutes: "",
        notifies: [],
        unreadMsgNum: 0,
        readMsgNum: 0,
      };
    },
    computed: {
      ...mapState({
        robots: (state) => state.machine.robots,
        curRobot: (state) => state.machine.curRobot,
        statistics: (state) => state.notification.statistics,
        warning: (state) => state.notification.warning,
        visible: (state) => state.chat.visible,
        isCall: (state) => state.chat.isCall,
      }),
      assistVisible: {
        get() {
          return this.visible;
        },
        set(val) {
          this[types.CHAT_DIALOG_VISIBLE](val);
        },
      },
      isCallUser: {
        get() {
          return this.isCall;
        },
        set(val) {
          this[types.IS_CALL](val);
        },
      },
      totalRows() {
        return this.robots.length;
      },
    },
    async created() {
      // console.log(this.$router.options.routes)
      this.curUser = getSession("userInfo");
      this.asyncRoutes = getSession("asyncRoutes");
      // console.log(this.asyncRoutes)
      const callbacks = {
        cbOnOpen: this.onWsOpen,
        cbOnClose: this.onWsClose,
        cbOnError: this.onWsError,
        cbOnMessage: this.onWsMessage,
        cbOnReconnect: this.onWsReconnect,
      };

      let wsClient = new WS(new Date().valueOf(), callbacks);
      wsClient.createWebSocket();
      await this[types.GET_ALL_ROLES]();
      await this[types.GET_ALL_MACHINES]();
      await this[types.GET_FAULT_TYPE]();
    },
    mounted() {
      this.initChatWS();
    },
    methods: {
      ...mapMutations({
        [types.SET_STATICTIS]: `notification/${[types.SET_STATICTIS]}`,
        [types.SET_WARNING]: `notification/${[types.SET_WARNING]}`,
        [types.CHAT_DIALOG_VISIBLE]: `chat/${[types.CHAT_DIALOG_VISIBLE]}`,
        [types.IS_CALL]: `chat/${[types.IS_CALL]}`,
      }),
      ...mapActions({
        [types.GET_ALL_ROLES]: `role/${[types.GET_ALL_ROLES]}`,
        [types.USER_LOGOUT]: `account/${[types.USER_LOGOUT]}`,
        [types.GET_ALL_MACHINES]: `machine/${[types.GET_ALL_MACHINES]}`,
        [types.GET_FAULT_TYPE]: `maintain/${[types.GET_FAULT_TYPE]}`,
      }),
      logout() {
        this[types.USER_LOGOUT]()
          .then(() => {
            this.$message.success("退出成功!");
            this.$router.push("/login");
            this.chatSocket.logout();
          })
          .catch((err) => {
            this.$message.error(err.msg);
          });
      },
      onWsOpen() {
        // this.wsLoading = false;
      },
      onWsClose() {

        console.log('vue this' + this)
        //通知组件没有关闭则不产生新的
        if (wsCloseNotify) return;
        wsCloseNotify = this.$notify.error({
          title: '错误',
          message: '当前网络异常，正在尝试重连...',
          duration: 0,
          onClose: () => {

            console.log('close wscloseNotify....')
            wsCloseNotify = null;
          }
        });

        // this.wsLoading = true;
      },
      onWsError() {},
      onWsMessage(data) {
        // console.log(data)
        if (data !== "heart") {
          console.log(JSON.parse(data))
          this[types.SET_STATICTIS](JSON.parse(data));
        }
      },
      onWsReconnect() {},
      initChatWS() {
        const user = {
          uid: this.curUser.id,
          name: this.curUser.userName,
          role: this.curUser.role.name,
        };
        const cbs = {
          onReceive: (res) => {
            this.caller = res.data.sender;
            if (!this.assistVisible) {
              this.notifies.push(
                this.$notify.info({
                  title: "您有一条新消息",
                  duration: 0,
                  dangerouslyUseHTMLString: true,
                  message: "<a class='viewMsg'>查看消息</a>",
                })
              );
              let viewBtns = Object.values(
                document.getElementsByClassName("viewMsg")
              );
              viewBtns.forEach(
                (btn) =>
                (btn.onclick = () => {
                  this.assistVisible = true;
                  this.notifies.forEach((not) => not.close());
                  this.notifies = [];
                })
              );
            }
          },
          onApply: (res) => {
            // res.self 对方  this.curUser 自己
            // reciever 对方  self 自己
            console.log(res);
            if (this.isCallUser) {
              this.chatSocket.reply(res.self, this.curUser, "3");
              return;
            }
            this.$confirm(
                res.self.name + " 向你请求视频通话, 是否同意?",
                "提示", {
                  confirmButtonText: "同意",
                  cancelButtonText: "拒绝",
                  type: "warning",
                }
              )
              .then(() => {
                this.assistVisible = true;
                this.$nextTick(async () => {
                  this.$refs.assist.videoChatVisible = true;
                  await this.$refs.assist.createP2P(res); // 同意之后创建自己的 peer 等待对方的 offer
                });
                this.isCallUser = res.self;
                this.chatSocket.reply(res.self, this.curUser, "1");
              })
              .catch((e) => {
                console.log(e);
                this.chatSocket.reply(res.self, this.curUser, "2");
              });
          },
          onReply: async (res) => {
            this.$refs.assist.loading = false;
            switch (res.type) {
              case "1": // 同意
                this.isCallUser = res.self;
                // 对方同意之后创建自己的 peer
                await this.$refs.assist.createP2P(res);
                // 并给对方发送 offer
                this.$refs.assist.createOffer(res);
                break;
              case "2": //拒绝
                this.$message({
                  message: "对方拒绝了你的请求！",
                  type: "warning",
                });
                break;
              case "3": // 正在通话中
                this.$message({
                  message: "对方正在通话中！",
                  type: "warning",
                });
                break;
            }
          },
          onOffer: (res) => {
            this.$refs.assist.onOffer(res);
          },
          onAnswer: (res) => {
            this.$refs.assist.onAnswer(res);
          },
          onIce: (res) => {
            this.$refs.assist.onIce(res);
          },
          onHangup: (res) => {
            this.$message({
              message: "对方已断开连接！",
              type: "warning",
            });
            this.$refs.assist.peer.close();
            this.$refs.assist.peer = null;
            this.isCallUser = false;
            this.$refs.assist.videoChatVisible = false;
            this.$refs.assist.chatStatus = false
          },
        };
        this.chatSocket = new chatUtils(user);
        this.chatSocket.init(cbs);
        if (user.role === "expert") {
          this.chatSocket.getNormalList();
        } else {
          this.chatSocket.getExpertList();
        }
      },
      async help() {
        this.readMsgNum = this.unreadMsgNum;
        this.unreadMsgNum = 0;
        // this.assistVisible = true;
        this.$nextTick(() => {
          this.$refs.assist.open(this.caller);
        });
        if (this.curUser.role.name === "expert") {
          await this.chatSocket.getNormalList();
        } else {
          await this.chatSocket.getExpertList();
        }
      },
    },
    watch: {
      chatSocket: {
        handler(val) {
          if (this.assistVisible) {
            this.unreadMsgNum = 0;
            this.readMsgNum = 0;
          } else {
            let count = 0;
            let msgMap = val.msgMap.size !== 0 ? val.msgMap : [];
            msgMap.forEach((v) => {
              count += v.receivedMsg.length;
            });
            this.unreadMsgNum = count - this.readMsgNum;
          }
        },
        deep: true,
      },
    },
  };
</script>

<style lang="less">
  #home {
    height: 100%;

    .el-badge {
      line-height: 0;
      margin-right: 15px;
    }

    .el-loading-spinner {
      font-size: 3rem !important;

      .el-loading-text {
        font-size: 3rem !important;
      }
    }

    .el-container {
      height: 100%;
    }

    .el-main {
      padding: 0;
    }

    .el-header {
      border-bottom: 1px solid #c9ccd3;
      background-color: #fefefe;
      line-height: 80px;

      .el-avatar {
        width: 60px;
        height: 60px;
        // margin-top: 8px;
        vertical-align: middle;
      }

      .username {
        // line-height: 80px;
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    .el-aside {
      background-color: #fff;
      height: 100%;
      box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.1);
      padding: 7px;
      z-index: 9;

      ul {
        li {
          height: 70px;
          line-height: 70px;
          padding-left: 20px;

          a {
            color: #303133; // 主要文本颜色
          }

          .icon {
            vertical-align: middle;
            font-size: 24px;
            line-height: 69px;
            margin-right: 8px;
          }
        }
      }
    }
  }

  .logout {
    margin-right: 10px;
  }

  .noScrollBar {
    scrollbar-width: none; //火狐可以用这个
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &::-ms-scrollbar {
      display: none;
    }

    &:-ms-scrollbar {
      display: none;
    }

    &::-o-scrollbar {
      display: none;
    }

    &::scrollbar {
      display: none;
    }

    &:scrollbar {
      display: none;
    }
  }
</style>
