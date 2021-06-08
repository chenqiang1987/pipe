import config from '@/config'

export default class WS {
  constructor(username, callbacks) {
    this.lockReconnect = false;
    this.wsUrl = `${config.wsUrl}/${username}`;
    // this.wsUrl = `${config.wsUrl}/${new Date().valueOf()}`;
    this.client = null;
    this.timer = null;
    this.heartCheckTimer = {
      timeout: 5000,
      clientTimer: null,
      serverTimer: null,
    },
    this.callbacks= callbacks
  }

  createWebSocket() {
    try {
      this.client = new WebSocket(this.wsUrl);
      this.init();
    } catch (e) {
      console.log('catch error: ', e);
      this.reconnect(this.callbacks.cbOnReconnect);
    }
  }

  init() {
    this.client.onclose = (e) => {
      console.log('connection closed');
      this.callbacks.cbOnClose && this.callbacks.cbOnClose();
      console.log(e.code + ' ' + e.reason + ' ' + e.wasClean)
      this.reconnect(this.callbacks.cbOnReconnect)
    }

    this.client.onerror = () => {
      console.log('exception occurred');
      console.log(cbOnError)
      this.callbacks.cbOnError && this.callbacks.cbOnError();
      this.reconnect(this.callbacks.cbOnReconnect)
    }

    this.client.onopen = () => {
      console.log('connected');
      this.callbacks.cbOnOpen && this.callbacks.cbOnOpen();
      this.heartCheck();
    }

    this.client.onmessage = (e) => {
      // console.log('message received: ', e.data);
      this.callbacks.cbOnMessage && this.callbacks.cbOnMessage(e.data);
      this.heartCheck();
    }
  }

  reconnect() {
    console.log('reconnecting...')
    this.callbacks.cbOnReconnect && this.callbacks.cbOnReconnect()
    if (this.lockReconnect) {
      return
    }
    //没连接上会一直重连，设置延迟避免请求过多
    this.lockReconnect = true;
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.createWebSocket(this.wsUrl)
      this.lockReconnect = false
    }, 5000);
  }

  heartCheck() {
    // console.log('---start heart check---');
    this.heartCheckTimer.clientTimer && clearTimeout(this.heartCheckTimer.clientTimer);
    this.heartCheckTimer.serverTimer && clearTimeout(this.heartCheckTimer.serverTimer);
    this.heartCheckTimer.clientTimer = setTimeout(() => {
      this.client.send("heart");
      this.heartCheckTimer.serverTimer = setTimeout(() => {
        this.client.close();
      }, this.heartCheckTimer.timeout);
    }, this.heartCheckTimer.timeout)
  }
}
