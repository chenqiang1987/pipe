import * as types from '../action-types';
import { setSession } from '@/utils/local'
// import {
//   asyncRoutes
// } from '@/router'
import { routes } from '@/router'

export default {
  state: {
    asyncRoutes: []
  },
  mutations: {
    [types.SET_ROUTES]: (state, routes) => {
      state.asyncRoutes = routes;
      setSession('asyncRoutes', state.asyncRoutes);
    }
  },
  actions: { //构建路由
    // async [types.GENERATE_ROUTES]({
    //   commit,
    //   dispatch
    // }, role) {
    //   let res = await dispatch(`permit/${types.GET_ROLE_PERMIT}`, role.id, {
    //     root: true
    //   });
    //   // 过滤出符合用户权限的路由
    //   asyncRoutes.filter(route => res.some(r => route.name === r.code))
    //   // console.log(asyncRoutes)
    //   return new Promise(resolve => {
    //     commit(types.SET_ROUTES, asyncRoutes);
    //     resolve(asyncRoutes)
    //   })
    // }

    async [types.GENERATE_ROUTES]({
      commit,
      dispatch
    }, role) {
      let _routes = routes[2].children;
      let res = await dispatch(`permit/${types.GET_ROLE_PERMIT}`, role.id, {
        root: true
      });
      let asyncRoutes = _routes.filter(route => res.some(r => route.name === r.code))
      console.log(asyncRoutes)
      return new Promise(resolve => {
        commit(types.SET_ROUTES, asyncRoutes);
        resolve(asyncRoutes)
      })
    }
  }
}
