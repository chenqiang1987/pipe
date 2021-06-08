export default {
    getAll: '/module/authc/getAll', //获取所有得感应模块
    getValue: '/module/authc/getValue', //获取机器人感应模块的阈值
    setValue: '/module/authc/setValue', //设置感应模块的阈值
    setModulesForMachine:'/module/authc/setModulesForMachine', //给机器人设置接收模块
    getModuleFromMachine: '/module/authc/getModuleFromMachine', //获取机器人已经设置的模块
    getCurveGraph: '/module/authc/curveGraph', //获取折线图数据
}