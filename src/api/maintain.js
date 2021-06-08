import config from './config/maintain'
import axios from '@/utils/request'

export const faultType = () => axios.post(config.faultType);

export const selectPage = params => axios.post(config.selectPage, params);

export const startRepair = query => axios.post(`${config.startRepair}?workId=${query}`);

export const resolveRepair = query => axios.post(`${config.resolveRepair}?workId=${query.workId}&content=${query.content}`);

export const unResolveRepair = query => axios.post(`${config.unResolveRepair}?workId=${query.workId}&content=${query.content}`);

export const createWorkOrder = params => axios.post(config.createWorkOrder, params);