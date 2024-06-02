import { defineStore } from 'pinia';
export const userInfoStore = defineStore('userInfo', {
    state: () => ({
        isLogin: false,
        userInfo: {
            fullname: '',
            email: '',
            token: '',
        }
    }),
    persist: {
        enabled: true
    },
    getters: {
        
    },
    actions: {
        setIsLogin(login: boolean) {
            this.isLogin = login;
        },
        setUserInfo(info) {
            this.userInfo = info;
        },
    }
})