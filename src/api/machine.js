import config from './config/machine'
import axios from '@/utils/request'

export const all = () => axios.post(config.all);

export const add = params => axios.post(`${config.add}?number=${params.number}&name=${params.name}`);

export const close = params => axios.post(config.close, params);

export const state = query => axios.post(`${config.state}?number=${query}`)

export const recharge = () => axios.post(config.recharge);

export const reportFault = params => axios.post(config.reportFault, params);

export const reportStatus = () => axios.post(config.reportStatus);

export const setHeart = params => axios.post(config.setHeart, params);

export const setPeriod = params => axios.post(config.setPeriod, params);

export const setSection = params => axios.post(config.setSection, params);

export const start = params => axios.post(config.start, params);

export const stop = params => axios.post(config.stop, params);
