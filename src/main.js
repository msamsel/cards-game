import Vue from 'vue'
// import App from './App.vue'
import Game from "@/Game";
import {BootstrapVue} from 'bootstrap-vue'

Vue.config.productionTip = false
window.axios = require('axios');

Vue.use(BootstrapVue);

new Vue({
    render: h => h(Game),
//   render: h => h(App),
}).$mount('#app')
