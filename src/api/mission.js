import config from './config/mission';
import axios from 'axios'

export const batchAutoMession = params => axios.post(config.batchAutoMession, params);

export const getAutoMessions = machineId => axios.post(`${config.getAutoMessions}?machineId=${machineId}`);