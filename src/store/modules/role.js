import * as role from '@/api/role'
import * as types from '../action-types'

export default {
    state: {
        roles: [],
    },
    mutations: {
        [types.SET_ALL_ROLES](state, roles) {
            state.roles = roles;
        },
    },
    actions: {
        async [types.GET_ALL_ROLES]({ commit }, payload) {
            try {
                const { data } = await role.allRoles(payload);
                commit(types.SET_ALL_ROLES, data.list);
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async [types.DEL_ONE_ROLE]({ commit }, payload) {
            console.log(payload)
            try {
                await role.deleteOne(payload);
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async [types.ADD_ONE_ROLE]({ commit }, payload) {
            try {
                await role.addOne(payload);
            } catch (e) {
                return Promise.reject(e);
            }
        },
        async [types.MODIFY_ONE_ROLE]({ commit }, payload) {
            try {
                await role.modifyOne(payload);
            } catch (e) {
                return Promise.reject(e);
            }
        }
    }
}