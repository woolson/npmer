import Vue from 'vue';
import {
  Button,
  ColorPicker,
  Form,
  FormItem,
  Input,
  Notification,
  Option,
  Select,
  Switch,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Clipboards from 'vue-clipboards';
import App from './app.vue';

Vue.config.productionTip = false;
Vue.component(Button.name, Button);
Vue.component(ColorPicker.name, ColorPicker);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Notification.name, Notification);
Vue.component(Option.name, Option);
Vue.component(Select.name, Select);
Vue.component(Switch.name, Switch);
Vue.use(Clipboards);

Vue.prototype.$notify = Notification;

new Vue({
  render: h => h(App),
}).$mount('#app');
