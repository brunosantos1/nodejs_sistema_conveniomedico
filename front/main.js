import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import validations from './validators/index.js'
import './assets/css/main.scss'
import { BFormSelect, BButton, ModalPlugin, BModal, BTooltip, BFormRadio, BFormGroup, BFormRadioGroup, BFormInvalidFeedback, BFormValidFeedback, BFormInput, BFormCheckbox, BCollapse, VBToggle } from 'bootstrap-vue'
import vSelect from 'vue-select'
import VueSweetalert2 from 'vue-sweetalert2';
import VueCarousel from 'vue-carousel';
import MQ from 'vue-match-media'


Vue.component('b-form-input', BFormInput)
Vue.component('b-button', BButton)
Vue.component('b-modal', BModal)
Vue.component('b-tooltip', BTooltip)
Vue.component('b-form-radio', BFormRadio)
Vue.component('b-form-radio-group', BFormRadioGroup)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form-invalid-feedback', BFormInvalidFeedback)
Vue.component('b-form-valid-feedback', BFormValidFeedback)
Vue.component('b-form-checkbox', BFormCheckbox)
Vue.component('b-collapse', BCollapse)
Vue.component('b-form-select', BFormSelect)
Vue.component('v-select', vSelect)
Vue.use(VueSweetalert2);
Vue.use(ModalPlugin)
Vue.use(VueCarousel);
Vue.directive('b-toggle', VBToggle)
Vue.use(MQ)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  validations,
  mq: {
    medium: '(min-width: 640px)',
    xmedium: '(min-width: 768px)',
    slarge: '(min-width: 992px)'
  },
  render: h => h(App)
}).$mount('#app')