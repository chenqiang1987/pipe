import * as maintain from '@/api/maintain';
import * as types from '../action-types';

export default {
  state: {
    faultList: [],
    maintainList: [],
    curMaintainOrder: null
  },
  mutations: {
    [types.CUR_MAINTAIN_ORDER](state, order) {
      state.curMaintainOrder = order;
    },
    [types.SET_FAULT_TYPE](state, list) {
      state.faultList = list;
    },
    [types.SET_MAINTAIN_LIST](state, list) {
      state.maintainList = list;
    },
  },
  actions: {
    async [types.GET_FAULT_TYPE]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await maintain.faultType();
        commit(types.SET_FAULT_TYPE, data);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.GET_MAINTAIN_LIST]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await maintain.selectPage(payload);
        let page = [];
        if (data && data.page) {
          page = data.page;
        }
        commit(types.SET_MAINTAIN_LIST, page);
      } catch (e) {
        commit(types.SET_MAINTAIN_LIST, []);
        return Promise.reject(e);
      }
    },
    async [types.CREATE_WORK_ORDER]({
      commit
    }, payload) {
      try {
        await maintain.createWorkOrder(payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.START_REPAIR]({
      commit
    }, payload) {
      try {
        await maintain.startRepair(payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.RESOLVE_REPAIR]({
      commit
    }, payload) {
      try {
        await maintain.resolveRepair(payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.UNRESOLVE_REPAIR]({
      commit
    }, payload) {
      try {
        await maintain.unResolveRepair(payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
  }
}
