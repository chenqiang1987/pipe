import config from './config/permit';
import axios from 'axios'

export const allPermits = () => axios.post(config.allPermits);

export const setRolePermit = query => axios.post(`${config.setPermitForRoleId}?roleId\=${query.roleId}&permitIds=${query.ids}`);


export const getRolePermit = query => axios.post(`${config.getPermitByRoleId}?roleId\=${query}`);
