export default {
    baseURL: process.env.NODE_ENV === 'development'? 'http://192.168.9.253:803':'http://192.168.9.253:803',
    wsUrl: process.env.NODE_ENV === 'development'? 'ws://192.168.9.253:803/webSocket':'ws://192.168.9.253:803/webSocket',
    chatWsUrl: process.env.NODE_ENV === 'development' ? 'ws://192.168.9.253:3000' : 'ws://192.168.9.253:3000'
}

console.log(process.env)