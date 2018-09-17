// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Tabs from './components/Tabs'
import TabPane from './components/TabPane'
import Collapse from './components/Collapse'
import CollapseItem from './components/CollapseItem'
import Carousel from './components/Carousel'
import CarouselItem from './components/CarouselItem'
import Message from './components/message/Message'

import './assets/index.scss'

Vue.config.productionTip = false
Vue.component('b-tabs', Tabs)
Vue.component('b-tab-pane', TabPane)
Vue.component('b-collapse', Collapse)
Vue.component('b-collapse-item', CollapseItem)
Vue.component('b-carousel', Carousel)
Vue.component('b-carousel-item', CarouselItem)
Vue.component('b-message', Message)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
