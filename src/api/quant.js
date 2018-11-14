import axios from '@/axios/config';
import qs from 'qs'

export default {
    // 获取机器人和策略
    getQuantList () {
        return axios.get('/u');
    },
    // 创建保存机器人
    saveRobotsConfig (params) {
        return axios.post('/u/strategy/exxmoving/save', qs.stringify(params));
    },
    // 删除机器人
    deleteRobot (params) {
        return axios.get(`/u/strategy/${params.alias}/delete?id=${params.id}`);
    },
    // 启动&停止机器人
    startUpRobot (params) {
        return axios.get(`/u/strategy/${params.alias}/changeStatus?id=${params.id}`);
    },
    // 启动所有机器人
    startUpAllRobot () {
        return axios.get('/u/allStart');
    },
    // 停止所有机器人
    stopAllRobot () {
        return axios.get('/u/allStop');
    },
    // 获取用户资金
    getAccountCoins (params) {
        return axios.get('/u/account/getBalance', {params});
    },
    // 获取平台列表
    getPlatformList () {
        return axios.get('/u/account/edit');
    },
    // 添加修改账户
    saveAccountInfo (params) {
        return axios.post('/u/account/save', qs.stringify(params));
    },
    // 获取用户资金
    deleteAccount (params) {
        return axios.get('/u/account/delete', {params});
    },
    // 重置机器人
    resetRobotById (params) {
        return axios.get(`/u/strategy/${params.alias}/reset?id=${params.id}`);
    },
    // 日志信息
    getLogInfos (params) {
        return axios.get('/u/strategy/ajax', {params});
    },
    // 清空日志
    clearLogs (params) {
        return axios.get('/u/strategy/clearLog', {params});
    },
    // 资金状态
    getCoinsStatus (params) {
        return axios.get(`/u/strategy/${params.alias}/getStatus?id=${params.id}`);
    },
    // 风险预警
    getWarnList (params) {
        return axios.get('/warn', {params});
    },
    // 成交记录
    getRecords (params) {
        return axios.get('/record', {params});
    },
    // 收益数据
    getRewardData (params) {
        return axios.get('/u/getCharts', {params});
    }
}
