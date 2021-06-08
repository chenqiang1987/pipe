import config from './config/account'
import axios from '@/utils/request'

export const reg = params => axios.post(config.reg, params);

export const login = params => axios.post(config.login, params);

export const getRolesByUser = () => axios.post(config.getRolesByUser);

export const logOut = () => axios.post(config.logOut);

export const updatePassword = params => axios.post(config.updatePassword, params);

export const selectPage = params => axios.post(config.selectPage, params);

export const addOrModifyOne = params => axios.post(config.addOrModifyOne, params);

export const deleteUser = query => axios.post(`${config.deleteUser}?userId=${query}`);

export const queryOne = params => axios.post(config.selectOne, params); //可以根据用户名或手机号查询

export const getUserMetier = query => axios.post(`${config.getFaultByUser}?userId=${query}`)

export const updateFaultForUser = query => axios.post(`${config.updateFaultForUser}?userId=${query.userId}&faults=${query.faults}`)
