import config from './config/role';
import axios from 'axios'

export const allRoles = () => axios.post(config.allRoles);

export const addOne = params => axios.post(config.addOne, params);

export const deleteOne = id => axios.post(`${config.deleteOne}?id=${id}`);

export const modifyOne = params => axios.post(config.modifyOne, params);
