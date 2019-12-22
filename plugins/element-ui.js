import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import Clipboards from 'vue-clipboards'

Vue.use(Clipboards)
Vue.use(Element, { locale })

Vue.prototype.colors = [
  '#E05D44',
  '#DFB317',
  '#44CC11',
  '#46BC99',
  '#007EC6',
  '#7289DA'
]
