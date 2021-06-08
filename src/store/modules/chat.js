import * as types from '../action-types';

export default {
  state: {
    visible: false,
    isCall: false
  },
  mutations: {
    [types.CHAT_DIALOG_VISIBLE](state, visible) {
      state.visible = visible;
    },
    [types.IS_CALL](state, isCall) {
      state.isCall = isCall;
    },
  },
}
