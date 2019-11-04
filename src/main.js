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
  Dialog,
  Radio,
  RadioGroup,
  RadioButton,
  Popover,
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
Vue.component(Dialog.name, Dialog);
Vue.component(Radio.name, Radio);
Vue.component(RadioButton.name, RadioButton);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(Popover.name, Popover);
Vue.use(Clipboards);

Vue.prototype.$notify = Notification;
Vue.prototype.$ELEMENT = { size: 'medium' };

new Vue({
  render: h => h(App),
}).$mount('#app');
