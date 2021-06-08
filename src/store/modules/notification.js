import * as types from '../action-types';

export default {
  state: {
    statistic: {
      msgId: "",
      enable: "1",
      co: 0,
      humidity: 0,
      hydrothion: 0,
      methance: 0,
      oxygen: 0,
      pm1: 0,
      pm10: 0,
      pm25: 0,
      serialNumber: 0,
      smoke: 0,
      temperature: 0,
      x: -1,
      y: -1
    },
    warninng: null
  },
  mutations: {
    [types.SET_STATICTIS](state, payload) {
      state.statistic = payload.machineWebScoketData;
    },
    [types.SET_WARNING](state, payload) {
      state.warninng = payload;
    },
  },
  actions: {

  }
}
