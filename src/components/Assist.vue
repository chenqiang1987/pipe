<template>
  <div id="chat-room">
    <el-row
      v-loading="loading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-col :span="18" class="chat-room">
        <el-card shadow="never">
          <div slot="header" style="text-align: center">
            <span
              v-if="socketData.user.role === 'expert'"
            >{{socketData.onlineNormalList.length !== 0 ? selectedUser.name : '暂无用户在线'}}</span>
            <span v-else>{{socketData.onlineExpertList.length !== 0 ? selectedUser.name : '暂无专家在线'}}</span>
          </div>
          <el-row class="received-msg noScrollBar">
            <div v-for="data in msgMap.msgList" :key="data.createTime" v-scroll>
              <template v-if="msgMap.sentMsg.includes(data)">
                <div class="sender-temp">
                  <p class="sender-time">{{data.createTime}}</p>
                  <div style="clear: both"></div>
                  <template v-if="data.msg.includes('data:image')">
                    <div class="sender-img">
                      <el-image
                        :src='data.msg.match(/src=[\"]?([^\"]*)[\"]?/i)[1]'
                        :preview-src-list='[data.msg.match(/src=[\"]?([^\"]*)[\"]?/i)[1]]'
                      ></el-image>
                    </div>
                  </template>
                  <template v-else>
                    <div v-html="data.msg" class="sender-msg">{{data.msg}}</div>
                  </template>
                </div>
              </template>
              <template v-if="msgMap.receivedMsg.includes(data)">
                <div class="receiver-temp">
                  <p class="receiver-time">{{data.createTime}}</p>
                  <div style="clear: both"></div>
                  <template v-if="data.msg.includes('data:image')">
                    <div class="receiver-img">
                      <el-image
                        :src='data.msg.match(/src=[\"]?([^\"]*)[\"]?/i)[1]'
                        :preview-src-list='[data.msg.match(/src=[\"]?([^\"]*)[\"]?/i)[1]]'
                      ></el-image>
                    </div>
                  </template>
                  <template v-else>
                    <div v-html="data.msg" class="receiver-msg">{{data.msg}}</div>
                  </template>
                </div>
              </template>
            </div>
          </el-row>
          <quill-editor
            v-model="inputMsg"
            ref="inputMsgArea"
            :options="editorOption"
            @enter.native="sendMsg"
          ></quill-editor>
          <div style="float: right">
            <el-button size="mini" style="margin: 0 10px 0 0" @click="sendMsg">发送</el-button>
            <el-button size="mini" style="margin: 0 10px 0 0" @click="applyVideoChat" :disabled="chatStatus">视频聊天</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="list">
          <div slot="header">
            <span>在线列表</span>
          </div>
          <template
            v-if="socketData.user.role !== 'expert' && socketData.onlineExpertList.length !== 0"
          >
            <div
              ref="expList"
              v-for="(user, idx) in socketData.onlineExpertList"
              class="select-user"
              :class="{selected: user.selectedIndex === user.id}"
              :key="idx"
              @click="selectUser(user, idx)"
            >
              <el-button type="text">{{user.name}}</el-button>
            </div>
          </template>
          <template
            v-else-if="socketData.user.role === 'expert' && socketData.onlineNormalList.length !== 0"
          >
            <div
              ref="normalList"
              v-for="(user, idx) in socketData.onlineNormalList"
              class="select-user"
              :class="{selected: user.selectedIndex === user.id}"
              :key="idx"
              @click="selectUser(user, idx)"
            >
              <el-button type="text">{{user.name}}</el-button>
            </div>
          </template>
          <template v-else>
            <span
              style="margin-left: 10px"
            >{{socketData.user.role === 'expert' ? '暂无用户在线' : '暂无专家在线'}}</span>
          </template>
          <div v-show="videoChatVisible"
           class="video-chat-wrapper"

          >
            <el-button size="mini" @click="hangup">挂断</el-button>
            <video
              width="222"
              height="200"
              controls
              playsinline
              autoplay
              id="videoChat"
              ref="videoChat"
            ></video>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import * as types from "../store/action-types";

export default {
  props: ["socketData"],
  data() {
    return {
      videoChatVisible: false,
      localstream: null,
      peer: null,
      loading: false,
      loadingText: "",
      chatStatus: false,
      offerOptions: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      },
      msgMap: {},
      selectedIdx: 0,
      selectedUser: {
        id: "",
        name: "",
        role: "",
      },
      inputMsg: "",
      editorOption: {
        modules: {
          toolbar: [
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            ["image"],
          ],
        },
      },
    };
  },
   computed: {
    ...mapState({
      isCall: (state) => state.chat.isCall,
    }),
    isCallUser: {
      get() {
        return this.isCall;
      },
      set(val) {
        this[types.IS_CALL](val);
      },
    }
  },
  directives: {
    scroll: {
      inserted(el) {
        el.scrollIntoView();
      },
    },
  },
  mounted() {
    // console.log(this.socketData)
    let textarea = document.getElementsByClassName("ql-editor")[0];
    textarea.onkeyup = (e) => {
      e.keyCode === 13 ? this.sendMsg() : null;
    };
  },
  methods: {
    ...mapMutations({
      [types.IS_CALL]: `chat/${[types.IS_CALL]}`,
    }),
    open(caller) {
      let _user = null,
          _idx = 0;
      if (
        this.socketData.user.role !== "expert" &&
        this.socketData.onlineExpertList.length !== 0
      ) {
        if (caller) {
          _user = this.socketData.onlineExpertList.filter((u, idx) => {
            if (u.id === caller.uid) {
              _idx = idx;
              return true
            }
          })[0]
        } else {
          _user = this.socketData.onlineExpertList[_idx];
        }
        let ctx = this.$refs.expList[_idx];
        ctx.setAttribute("class", "select-user selected");
        this.selectedUser = _user;
      } else if (
        this.socketData.user.role === "expert" &&
        this.socketData.onlineNormalList.length !== 0
      ) {
        if (caller) {
          _user = this.socketData.onlineNormalList.filter((u, idx) => {
            if (u.id === caller.uid) {
              _idx = idx;
              return true
            }
          })[0]
        } else {
          _user = this.socketData.onlineNormalList[_idx];
        }
        let ctx = this.$refs.normalList[_idx];
        ctx.setAttribute("class", "select-user selected");
        this.selectedIdx = _idx;
        this.selectedUser = _user;
      }
    },
    selectUser(user, idx) {
      if (user.id === this.selectedUser.id) {
        return
      }
      this.socketData.onlineExpertList.forEach((v) => delete v.selectedIndex);
      this.socketData.onlineNormalList.forEach((v) => delete v.selectedIndex);
      if (this.socketData.user.role !== "expert" && this.socketData.onlineExpertList.length !== 0) {
        for (let i = 0; i < this.$refs.expList.length; i++) {
          this.$refs.expList[i].setAttribute("class", "select-user")
        }
      }
      else if (this.socketData.user.role === "expert" && this.socketData.onlineNormalList.length !== 0) {
        for (let i = 0; i < this.$refs.normalList.length; i++) {
          this.$refs.normalList[i].setAttribute("class", "select-user")
        }
      }

      // if (
      //   this.socketData.user.role !== "expert" &&
      //   this.socketData.onlineExpertList.length !== 0
      // ) {
      //   if (this.$refs.expList[this.selectedIdx].getAttribute("class").includes("selected")) {
      //     this.$refs.expList[this.selectedIdx].setAttribute("class", "select-user");
      //   }
      // } else if (
      //   this.socketData.user.role === "expert" &&
      //   this.socketData.onlineNormalList.length !== 0
      // ) {
      //   if (
      //     this.$refs.normalList[this.selectedIdx].getAttribute("class").includes("selected")
      //   ) {
      //     this.$refs.normalList[this.selectedIdx].setAttribute("class", "select-user");
      //   }
      // }
      this.$set(user, "selectedIndex", user.id);
      this.selectedIdx = idx
      this.selectedUser = user;
      // console.log(this.selectedUser)
    },
    sendMsg() {
      let content = this.inputMsg;
      if (this.inputMsg) {
        content =this.inputMsg.match(/<p(([\s\S])*?)<\/p>/g)[0];
        if (content.includes("<br>")) {
          return;
        }
      }
      if (!content) {
        this.$message.error("发送消息不能为空！");
        return;
      }
      if (
        this.socketData.user.role !== "expert" &&
        this.socketData.onlineExpertList.length === 0
      ) {
        this.$message.error("暂无专家在线！");
        return;
      } else if (
        this.socketData.user.role === "expert" &&
        this.socketData.onlineNormalList.length === 0
      ) {
        this.$message.error("暂无用户在线！");
        return;
      }
      this.socketData.p2pSend(this.socketData.user, this.selectedUser, content);
      this.inputMsg = "";
    },
    gotRemoteStream(e) {
      let videoContainer = document.querySelector('#videoChat');
	    if (videoContainer.srcObject !== e.streams[0]) {
        videoContainer.srcObject = e.streams[0];
        console.log('received remote stream');
        this.loading = false
	    }
    },
    getSelectedSdpSemantics(type) {
      // TYPE '' 'unified-plan' 'plan-b'
      return !type ? {} : {
        sdpSemantics: type
      };
    },
    applyVideoChat() {
      if (
        this.socketData.user.role !== "expert" &&
        this.socketData.onlineExpertList.length === 0
      ) {
        this.$message.error("暂无专家在线！");
        return;
      } else if (
        this.socketData.user.role === "expert" &&
        this.socketData.onlineNormalList.length === 0
      ) {
        this.$message.error("暂无用户在线！");
        return;
      }
      this.videoChatVisible = true;
      this.loading = true;
      this.loadingText = '呼叫中';
      this.socketData.apply(this.selectedUser, this.socketData.user);
    },
    async createP2P(data) {
      this.loading = true;
      this.loadingText = "正在建立通话连接";
      await this.createMedia(data);
    },
    async createMedia(data) {
      console.log("Requesting local stream");
      // 保存本地流到全局
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log("Received local stream");

        // let videoContainer = document.querySelector('videoChat')
        // console.log(videoContainer);
        // console.log(this.localstream);
        // videoContainer.srcObject = this.localstream;

        // 设置视频通话按钮不可用
        this.chatStatus = true
        this.initPeer(data); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
      } catch (e) {
        console.log(`getUserMedia() error: ${e}`);
      }
    },
    initPeer(data) {
      // 创建输出端 PeerConnection
      let PeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      const configuration = this.getSelectedSdpSemantics();
      console.log('RTCPeerConnection configuration:', configuration);
      this.peer = new PeerConnection(configuration);
      console.log('Created peer connection');
      // 监听ICE候选信息 如果收集到，就发送给对方
      this.peer.addEventListener('icecandidate', async e => {
        if (e.candidate) {
          this.socketData.sendIcecandidate(data.self, data.receiver, e.candidate)
        }
      });
      this.localStream.getTracks().forEach(track => this.peer.addTrack(track, this.localStream));
      console.log('Added local stream');
      // this.remotePeer.onaddstream = (e) => {
      //   // 监听是否有媒体流接入
      //   // this.isToPeer = true;
      //   // this.loading = false;
      //   let video = document.querySelector('#videoChat');
      //   console.log(e.stream);
      //   video.srcObject = event.stream;
      // };
	    this.peer.addEventListener('track', this.gotRemoteStream);
    },
    async createOffer(data) {
      // 创建并发送 offer
      try {
        // 创建offer
        let offer = await this.peer.createOffer(this.offerOptions);
        // 呼叫端设置本地 offer 描述
        await this.peer.setLocalDescription(offer);
        // 给对方发送 offer
        this.socketData.offer(data.self, data.receiver, offer)
      } catch (e) {
        console.log("createOffer: ", e);
      }
    },
    async onOffer(data) {
      // 接收offer并发送 answer
      try {
        // 接收端设置远程 offer 描述
        await this.peer.setRemoteDescription(data.sdp);
        // 接收端创建 answer
        const answer = await this.peer.createAnswer();
        // 接收端设置本地 answer 描述
        await this.peer.setLocalDescription(answer);
        // 给对方发送 answer
        this.socketData.answer(data.self, data.receiver, answer)
      } catch (e) {
        console.log("onOffer: ", e);
      }
    },
    async onAnswer(data) {
      // 接收answer
      try {
        await this.peer.setRemoteDescription(data.sdp); // 呼叫端设置远程 answer 描述
      } catch (e) {
        console.log("onAnswer: ", e);
      }
    },
    async onIce(data) {
      // 接收 ICE 候选
      try {
        await this.peer.addIceCandidate(data.sdp); // 设置远程 ICE
      } catch (e) {
        console.log("onIce: ", e);
      }
    },
    hangup() {
      this.isCallUser.uid = this.isCallUser.id;
      this.socketData.hangup(this.isCallUser, this.socketData.user);
      this.peer.close();
      this.peer = null;
      this.isCallUser = false;
      this.videoChatVisible = false;
      this.chatStatus = false
    }
  },
  watch: {
    socketData: {
      handler(val, oldVal) {
        this.msgMap = val.msgMap.has(this.selectedUser.id)
          ? val.msgMap.get(this.selectedUser.id)
          : {
              msgList: [],
              sentMsg: [],
              receivedMsg: [],
            };
      },
      deep: true,
    },
  },
};
</script>

<style lang="less">
#chat-room {
  .el-card__body {
    padding: 20px 0 0 0;
    min-height: 600px;
    .video-chat-wrapper {
      text-align: center;
      position: absolute;
      bottom: 0;
    }
    .received-msg {
      position: relative;
      height: 380px;
      overflow-y: auto;
      img {
        display: inline-block;
        max-width: 15%;
        max-height: 15%;
      }
      .sender {
        &-temp {
          overflow: hidden;
          padding-right: 20px;
        }
        &-time {
          float: right;
          color: #000;
          margin-bottom: 6px;
        }
        &-img {
          img {
            float: right;
            margin-bottom: 6px;
          }
        }
        &-msg {
          float: right;
          background: #9eea6a;
          padding: 5px;
          border: 1px solid powderblue;
          border-radius: 5px;
          margin-bottom: 6px;
        }
      }
      .receiver {
        &-temp {
          overflow: hidden;
          padding-left: 20px;
        }
        &-time {
          float: left;
          color: #000;
          margin-bottom: 6px;
        }
        &-msg {
          float: left;
          background: #f6f6f6;
          padding: 5px;
          border: 1px solid #e7e7e7;
          border-radius: 5px;
          margin-bottom: 6px;
        }
      }
    }
    .quill-editor {
      width: 100%;
      height: 120px;
      margin-bottom: 60px;
      .ql-container,
      .ql-toolbar {
        border: 1px solid #ebeef5;
      }
      .ql-container {
        border-bottom: 0;
      }
    }
    .select-user {
      padding-left: 20px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .selected {
    background-color: powderblue;
    opacity: 0.7;
  }
}
</style>
