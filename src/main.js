import Vue from 'vue'
import Game from "@/Game";
import {BootstrapVue} from 'bootstrap-vue'

Vue.config.productionTip = false
window.axios = require('axios');

Vue.use(BootstrapVue);

new Vue({
    render: h => h(Game),

}).$mount('#app')
