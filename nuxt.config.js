
export default {
  mode: 'spa',
  /** Headers of the page */
  head: {
    title: 'NPMer Badge',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /** Customize the progress-bar color */
  loading: { color: '#fff' },
  /** Global CSS */
  css: [
    // 'element-ui/lib/theme-chalk/index.css',
    'assets/css/element/index.css',
    'assets/stylus/index.styl'
  ],
  /** Plugins to load before mounting the App */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/i18n-setup',
  ],
  /** Nuxt.js dev-modules */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /** Nuxt.js modules */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    stylus: 'assets/stylus/variables.styl'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: 'https://woolson.cn/npmer/api',
  },
  /** Build configuration */
  build: {
    transpile: [/^element-ui/],
    /** You can extend webpack config here */
    extend (config, ctx) {
    }
  }
}
