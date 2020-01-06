import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

let lang = window.navigator.language === 'zh-CN' ? 'zh' : 'en'
const cacheLang = localStorage.getItem('LANGUAGE')

if (cacheLang) { lang = cacheLang }

export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages: {
      en: require('~/i18n/en.js').default,
      zh: require('~/i18n/zh.js').default
    }
  })
}
