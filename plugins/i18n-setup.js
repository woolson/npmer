import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: window.navigator.language === 'zh-CN' ? 'zh' : 'en',
    fallbackLocale: 'en',
    messages: {
      en: require('~/i18n/en.js').default,
      zh: require('~/i18n/zh.js').default
    }
  })
}
