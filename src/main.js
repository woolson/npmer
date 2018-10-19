import Vue from 'vue';
import {
  Button,
  Form,
  Input,
  FormItem,
  Switch,
  Notification,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as GitHubApi from '@octokit/rest';
import Clipboards from 'vue-clipboards';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.component(Button.name, Button);
Vue.component(Form.name, Form);
Vue.component(Input.name, Input);
Vue.component(FormItem.name, FormItem);
Vue.component(Switch.name, Switch);
Vue.component(Notification.name, Notification);
Vue.use(Clipboards);

Vue.prototype.$notify = Notification;
Vue.prototype.$github = GitHubApi();

new Vue({
  render: h => h(App),
}).$mount('#app');
