import Vue from 'vue';
import {
  Button,
  Form,
  Input,
  FormItem,
  Switch,
  Message,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.component(Button.name, Button);
Vue.component(Form.name, Form);
Vue.component(Input.name, Input);
Vue.component(FormItem.name, FormItem);
Vue.component(Switch.name, Switch);
Vue.component(Message.name, Message);

Vue.prototype.$message = Message;

new Vue({
  render: h => h(App),
}).$mount('#app');
