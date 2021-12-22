import Vue from 'vue'
import Vuex from 'vuex'
import {
  getItem,
  setItem
} from '@/utils/storage'
Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 一个对象 储存当前登录用户信息(token等数据)
    user: getItem(TOKEN_KEY) || null
  },
  mutations: {
    setUser(state, data) {
      state.user = data

      // 为了防止刷新丢失 我们需要吧数据备份到本地存储
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
