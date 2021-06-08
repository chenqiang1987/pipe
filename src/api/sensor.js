import config from './config/sensor';
import axios from 'axios'

export const getAll = () => axios.post(config.getAll);

export const getValue = machineId => axios.post(`${config.getValue}?machineId=${machineId}`);

export const getModuleFromMachine = machineId => axios.post(`${config.getModuleFromMachine}?machineId=${machineId}`);

export const setModulesForMachine = params => axios.post(`${config.setModulesForMachine}?machineId=${params.machineId}&modules=${params.sensorIds}`);

export const setValue = params => axios.post(config.setValue, params);

export const getCurveGraph = params => axios.post(config.getCurveGraph, params);
