import io from "socket.io-client";
import config from "@/config";
import moment from "moment"

export default class ChatUtils {
  constructor(user) {
    this.user = user
    this.socket = io(config.chatWsUrl);
    this.onlineExpertList = [];
    this.onlineNormalList = [];
    this.msgMap = new Map();
    this.callbacks = null;
  }

  initcbs(cbs) {
    cbs ? this.callbacks = cbs : null
  }

  init(cbs) {
    this.initcbs(cbs);
    this.socket.on("connect", () => {
      // console.log(socket.connected); // true
      this.socket.emit("login", this.user);
    });

    this.socket.on("disconnect", () => {
      // console.log(socket.connected); // false
      if (this.socket.disconnected) {
        this.socket.emit("login", this.user);
      }
    });

    this.socket.on("message", (res) => {
      if (res.data) {
        if (this.user.role === 'expert') {
          this.onlineNormalList = res.data
        } else {
          this.onlineExpertList = res.data
        }
      }
    });

    // 接收信息
    this.socket.on("receive", (res) => {
      if (res.code === 200) {
        const senderId = res.data.sender.uid
        if (!this.msgMap.has(senderId)) {
          this.msgMap.set(senderId, {
            msgList: [],
            sentMsg: [],
            receivedMsg: []
          })
        }
        this.msgMap.get(senderId).receivedMsg.push(res.data);
        this.msgMap.get(senderId).msgList.push(res.data);
        this.callbacks.onReceive && this.callbacks.onReceive(res);
      }
    });

    // 收到回复
    this.socket.on('reply', async res => {
      this.callbacks.onReply && this.callbacks.onReply(res);
    });

    // 收到请求
    this.socket.on('apply', res => {
      this.callbacks.onApply && this.callbacks.onApply(res);
    })

    // 收到邀请
    this.socket.on('1v1offer', res => {
      this.callbacks.onOffer && this.callbacks.onOffer(res);
    })

    // 收到应答
    this.socket.on('1v1answer', res => {
      this.callbacks.onAnswer && this.callbacks.onAnswer(res);
    })

    // 收到ice
    this.socket.on('1v1ICE', res => {
      this.callbacks.onIce && this.callbacks.onIce(res);
    })

    // 收到挂断
    this.socket.on('1v1hangup', res => {
      this.callbacks.onHangup && this.callbacks.onHangup(res);
    })
  }

  // 发送消息
  p2pSend(sender, receiver, msg) {
    this.socket.emit("send", sender, receiver, msg);
    const _msg = {
      sender,
      msg,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const receiverId = receiver.id;
    if (!this.msgMap.has(receiverId)) {
      this.msgMap.set(receiverId, {
        msgList: [],
        sentMsg: [],
        receivedMsg: []
      })
    }
    this.msgMap.get(receiverId).sentMsg.push(_msg)
    this.msgMap.get(receiverId).msgList.push(_msg)
  }

  apply(receiver, self) {
    this.socket.emit("apply", {
      receiver,
      self
    });
  }

  reply(receiver, self, type) {
    this.socket.emit("reply", {
      receiver,
      self,
      type
    });
  }

  sendIcecandidate(receiver, self, sdp) {
    this.socket.emit("1v1ICE", {
      receiver,
      self,
      sdp,
    });
  }

  offer(receiver, self, sdp) {
    this.socket.emit("1v1offer", {
      receiver,
      self,
      sdp
    });
  }

  answer(receiver, self, sdp) {
    this.socket.emit("1v1answer", {
      receiver,
      self,
      sdp
    });
  }

  hangup(receiver, self) {
    this.socket.emit('1v1hangup', {
      receiver,
      self
    });
  }

  // 退出
  logout() {
    console.log("logout")
    this.socket.emit('logout');
  }

  // 获取在线专家列表
  getExpertList() {
    this.socket.emit('getExpertList');
  }

  getNormalList() {
    this.socket.emit('getNormalList');
  }
}
