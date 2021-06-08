import * as permit from '@/api/permit';
import * as types from '../action-types';

export default {
    state: {
        permitlist: {
            data: [],
            total: 0
        },
        selectedPermits: []
    },
    mutations: {
        [types.SET_ALL_PERMITS](state, permitlist) {
            state.permitlist = permitlist;
        },
        [types.SET_SELECTED_PERMITS](state, selected) {
            state.selectedPermits = selected;
        },
    },
    actions: {
        async [types.GET_ALL_PERMITS]({ commit }) {
            try {
                const { data } = await permit.allPermits();
                data.forEach(v => v.id === 3 ? v.disabled = true : null)
                commit(types.SET_ALL_PERMITS, data);
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async [types.SET_ROLE_PERMIT]({ commit }, payload) {
            try {
                await permit.setRolePermit(payload);
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async [types.GET_ROLE_PERMIT]({ commit }, payload) {
            try {
                const { data } = await permit.getRolePermit(payload);
                commit(types.SET_SELECTED_PERMITS, data);
                return Promise.resolve(data)
            } catch (e) {
                return Promise.reject(e);
            }
        }
    }
}