export default {
    reg: '/user/register', //用户注册
    login:'/user/loginByUserName', //用户登录
    getRolesByUser: '/role/authc/getRolesByUser', //查询当前登陆用户的角色
    logOut:'/user/logOut', //注销登陆
    updatePassword: '/user/authc/updatePassword', //修改用户密码
    selectOne: '/user/authc/selectOne', //获取单个用户信息
    selectPage: '/user/authc/selectPage', //分页获取用户列表
    addOrModifyOne: '/user/authc/addOrModifyOne', //新增或者修改单个用户
    deleteUser: '/user/authc/deleteUser', //删除单个用户
    getFaultByUser: '/maintain/authc/getFaultByUser', //获取专家的擅长领域
    updateFaultForUser: '/user/authc/updateFaultForUser', //给专家配置故障
}