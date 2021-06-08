export default {
    add: '/machine/authc/add', //新增机器人
    all: '/machine/authc/all', //机器人列表
    close:'/machine/authc/close', //关闭机器人
    state: '/machine/authc/state', //机器人状态
    recharge:'/machine/authc/recharge', //返回充电装
    reportFault: '/machine/authc/reportFault', //故障上报：机器人主动上报故障信息
    reportStatus: 'POST /machine/authc/reportStatus', //状态上报：定时上报机器人状态信息.位置+电量等信息
    setHeart: '/machine/authc/setHeart', //心跳频率设置：每隔多少秒发送一次检测数据
    setPeriod: '/machine/authc/setPeriod', //设置巡检周期:每隔多少分钟巡检一次
    setSection: '/machine/authc/setSection', //半自动设置巡检区间
    start: '/machine/authc/start', //启动机器人
    stop: '/machine/authc/standby', //停止机器人
}