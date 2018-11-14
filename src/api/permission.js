import axios from '@/axios/config';
import qs from 'qs'

export default {
    // 获取用户列表
    getUsers (params) {
        return axios.get('/u/user/ajax', {params});
    },
    // 新增用户&编辑用户
    addEditUsers (params) {
        return axios.post('/u/user/save', qs.stringify(params));
    },
    // 冻结&删除&还原
    editAccountStatus (params) {
        return axios.get('/u/user/changeStatus', {params});
    }
}
