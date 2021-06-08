import Vue from 'vue'
import Vuex from 'vuex'
import rootModule from './rootModule';//在store里新建rootModule.js文件   根模块

Vue.use(Vuex);
//require.context()动态加载模块，实现store的状态分割
//读取modules的目录,不读子目录,匹配.js文件
const files = require.context('./modules', false, /\.js$/);
files.keys().forEach(key => {
    // 模块对应的内容
    let store = files(key).default;
    let moduleName = key.replace(/^\.\//, '').replace(/\.js$/, '');
    // 动态的添加模块
    let modules = rootModule.modules = (rootModule.modules || {});
    modules[moduleName] = store;
    modules[moduleName].namespaced = true;
});
let store = new Vuex.Store(rootModule);
export default store;
