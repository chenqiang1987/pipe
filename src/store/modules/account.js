import * as account from '@/api/account';
import * as types from '../action-types';

// import { resetRouter } from '@/router'

import {
  setSession
} from '@/utils/local';
import {
  removeSession
} from '../../utils/local';
export default {
  state: {
    userInfo: {
      id: '',
      userName: '',
      telPhone: '',
      role: ''
    },
    userlist: {
      data: [],
      total: 0
    },
    userMetier: []
  },
  mutations: {
    [types.SET_USER](state, userInfo) {
      state.userInfo = userInfo;
      setSession("userInfo", userInfo);
      setSession("userName", userInfo.userName);
      setSession("hasPermission", true)
    },
    [types.SET_ALL_USERS](state, userlist) {
      state.userlist = userlist;
    },
    [types.SET_USER_METIER](state, payload) {
      state.userMetier = payload
    }
  },
  actions: {
    async [types.USER_LOGIN]({
      commit,
      dispatch
    }, payload) {
      try {
        await account.login(payload);
        let role = await dispatch(types.GET_USER_AUTH);
        let userDetails = await dispatch(types.QUERY_ONE_USER, {userName: payload.userName});
        let userInfo = {
          id: userDetails.id,
          userName: payload.userName,
          telPhone: userDetails.telPhone,
          role: role
        }
        commit(types.SET_USER, userInfo);
        // resetRouter()
        await dispatch(`permission/${types.GENERATE_ROUTES}`, role, {root: true})
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.GET_USER_AUTH]() {
      try {
        const {
          data
        } = await account.getRolesByUser();
        const role = {
          id: data.list[0].id,
          name: data.list[0].name
        }
        return Promise.resolve(role);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.USER_LOGOUT]({
      commit
    }) {
      try {
        await account.logOut();
        commit(types.SET_USER, {
          userName: '',
          role: ''
        });
        removeSession("userInfo");
        removeSession("userName");
        removeSession("hasPermission");
        // removeSession("isMounted");
        removeSession("asyncRoutes");
        // resetRouter()
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.GET_ALL_USERS]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await account.selectPage(payload);
        let page = data.page;
        page.data = page.data.map(v => {
          if (v.roles && v.roles.length && v.roles.length !== 0) {
            // roles唯一，默认取数组第一个
            // if (v.roles.length > 1) {
            //   v.role = v.roles.map(_v => _v.nickName).toString();
            // } else v.role = v.roles[0].nickName;
            v.role = v.roles[0].nickName
          }
          return v;
        });
        commit(types.SET_ALL_USERS, page);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.ADD_OR_MODIFY_ONE_USER]({
      commit
    }, payload) {
      try {
        await account.addOrModifyOne(payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.DEL_ONE_USER]({
      commit
    }, payload) {
      try {
        await account.deleteUser(payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.QUERY_ONE_USER]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await account.queryOne(payload);
        return Promise.resolve(data);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.GET_USER_METIER]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await account.getUserMetier(payload);
        commit(types.SET_USER_METIER, data)
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.SET_METIER_FOR_USER]({
      commit
    }, payload) {
      try {
        await account.updateFaultForUser(payload);
        if (!payload.faults) {
          payload.faults = []
        }
        commit(types.SET_USER_METIER, payload.faults)
      } catch (e) {
        return Promise.reject(e);
      }
    },
  }
}
