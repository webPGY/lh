import axios from 'axios';
import store from '@/store/index.js';
import router from '@/router/index';
import env from '../../build/env';
import iView from 'iview';
import locale from '@/locale/locale.js';
import Cookies from 'js-cookie';
import util from '@/libs/util.js';
import md5 from 'md5';
import qs from 'qs';
import _ from 'underscore';

/* 开发环境 */
// const ajaxUrl = env === 'development' ? 'http://quant.exx.com:8080/proxy/' : 'https://backend.exx-et.com/';
const ajaxUrl = env === 'development' ? 'http://quant.exxstar.com:8080/proxy/' : 'https://backend.exx-et.com/';

// axios 配置
axios.defaults.timeout = 3600000;

axios.defaults.baseURL = ajaxUrl;

axios.defaults.withCredentials = false;

// http request 拦截器
/* axios.interceptors.request.use(
    config => {
        if (Cookies.get('token') != '') {
            config.headers.common['token'] = Cookies.get('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
); */

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response) {
            if (_.isObject(response.data)) {
                if (!response.data.isSuc) {
                    // 返回接口返回的错误信息
                    if (response.data.des === '当前未登录') {
                        // 退出登录
                        Cookies.remove('user');
                        Cookies.remove('access');
                        // 恢复默认样式
                        let themeLink = document.querySelector('link[name="theme"]');
                        themeLink.setAttribute('href', '');
                        // 清空打开的页面等数据，但是保存主题数据
                        let theme = '';
                        if (localStorage.theme) {
                            theme = localStorage.theme;
                        }
                        localStorage.clear();
                        if (theme) {
                            localStorage.theme = theme;
                        }
                        // 跳至登录
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1000);
                    } else {
                        iView.Message.error(response.data.des || 'error');
                    }
                }
            }
        }
        return response;
    },
    error => {
        // store.commit("HIDELOADING")
        if (error.response) {
            switch (error.response.status) {
                case 504:
                    iView.Message.error('504 error');
                    break;
                case 500:
                    iView.Message.error('500 error');
                    break;
                case 404:
                    iView.Message.error('404 error');
                    break;
                default:
                    // 返回接口返回的错误信息
                    iView.Message.error(error.message);
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
