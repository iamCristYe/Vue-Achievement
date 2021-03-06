import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import titleComponent from './title.vue';

Vue.config.productionTip = false
Vue.component('vue-title', titleComponent);
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
