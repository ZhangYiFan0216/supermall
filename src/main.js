import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' 

import Fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//添加事件总线对象
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)

//解决移动端300ms延迟
Fastclick.attach(document.body)

//使用懒加载的插件
Vue.use(VuelazyLoad,{
  loading: require('./assets/images/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
