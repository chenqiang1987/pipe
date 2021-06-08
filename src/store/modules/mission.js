import * as mission from '@/api/mission';
import * as types from '../action-types';

export default {
  state: {
    missions: [],
    curRobot: {
      id: 0,
      name: ''
    }
  },
  mutations: {
    [types.SET_AUTO_MISSIONS](state, missions) {
      state.missions = missions;
    }
  },
  actions: {
    async [types.GET_AUTO_MISSIONS]({
      commit,
    }, machineId) {
      try {
        const {
          data
        } = await mission.getAutoMessions(machineId);
        commit(types.SET_AUTO_MISSIONS, data);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.BATCH_AUTO_MISSIONS]({
      commit,
    }, payload) {
      try {
        const {
          data
        } = await mission.batchAutoMession(payload);
        return Promise.resolve(data)
      } catch (e) {
        return Promise.reject(e);
      }
    },
  }
}
