import * as machine from '@/api/machine';
import * as types from '../action-types';

export default {
  state: {
    robots: [],
    curRobot: {
        id: 0,
        name: ''
    }
  },
  mutations: {
    [types.SET_ALL_MACHINES](state, robots) {
      state.robots = robots;
    },
    [types.SET_CUR_MACHINE](state, cur) {
      state.curRobot = cur;
    },
  },
  actions: {
    async [types.GET_ALL_MACHINES]({
      commit,
      state
    }) {
      try {
        const {
          data
        } = await machine.all();
        commit(types.SET_ALL_MACHINES, data);
        if (!state.curRobot.name) {
          commit(types.SET_CUR_MACHINE, data[0])
        }
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.MACHINE_STATE]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await machine.state(payload);
        return Promise.resolve(data)
      } catch (e) {
        return Promise.reject(e);
      }
    },

    async [types.ADD_MACHINE]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await machine.add(payload);
        return Promise.resolve(data)
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async [types.MACHINE_STOP]({
      commit
    }, payload) {
      try {
        const {
          data
        } = await machine.stop(payload);
        return Promise.resolve(data)
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}
