import axios from '@/axios/config';
import qs from 'qs'

export default {
    // 登录
    submitLogin (params) {
        return axios.post('/user/doLogin', qs.stringify(params));
    },
    // 退出登录
    loginOut () {
        return axios.get('/user/logout');
    }
}
