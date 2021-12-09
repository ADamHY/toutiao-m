// ajax 请求模块封装
import axios from 'axios'
// axios.default.baseUrl  ='http://toutiao.itheima.net'
// request 是生成的实例对象
const request = axios.create({
  // 项目的跟地址
  baseURL: 'http://toutiao.itheima.net'
})
// 导出封装好的请求模块
export default request
