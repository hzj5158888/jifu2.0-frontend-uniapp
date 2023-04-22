import Vue from 'vue'
import App from './App'
import * as filter from './utils/filter.js'// 引入时间过滤器
Vue.config.productionTip = false

App.mpType = 'app'
//注册过滤器
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})

const app = new Vue({
    ...App
})
app.$mount()
