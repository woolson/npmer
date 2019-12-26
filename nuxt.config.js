
export default {
  mode: 'spa',
  server: {
    port: 3001,
    host: '0.0.0.0'
  },
  /** Headers of the page */
  head: {
    title: 'NPMer Badge',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1575457_z1ixnr4lu1.css' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto' }
    ]
  },
  generate: {
    dir: 'docs'
  },
  /** Customize the progress-bar color */
  loading: {
    css: false
  },
  router: {
    middleware: 'auth'
  },
  /** Global CSS */
  css: [
    'assets/css/element/index.css',
    'assets/stylus/index.styl'
  ],
  /** Plugins to load before mounting the App */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/i18n-setup'
  ],
  /** Nuxt.js dev-modules */
  buildModules: [
    '@nuxtjs/eslint-module'
  ],
  /** Nuxt.js modules */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'nuxt-rfg-icon'
  ],
  styleResources: {
    stylus: 'assets/stylus/variables.styl'
  },
  /** Axios module configuration */
  proxy: {
    '/npmer': {
      target: 'https://woolson.cn/'
    }
  },
  /** Build configuration */
  build: {
    transpile: [/^element-ui/],
    /** You can extend webpack config here */
    extend (config, ctx) {
    }
  }
}
