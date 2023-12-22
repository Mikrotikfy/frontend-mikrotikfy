import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s',
    title: 'API ARNOP',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/main.css'
  ],

  publicRuntimeConfig: {
    API_STRAPI_ENDPOINT: process.env.API_STRAPI_ENDPOINT || 'http://localhost:1337/api/',
    CDN_STRAPI_ENDPOINT: process.env.CDN_STRAPI_ENDPOINT || 'http://localhost:1337',
    META_ENDPOINT: process.env.NODE_ENV === 'production' ? process.env.META_PROD_ENDPOINT : process.env.META_DEV_ENDPOINT,
    META_TEMPLATE: process.env.NODE_ENV === 'production' ? process.env.META_PROD_TEMPLATE : process.env.META_DEV_TEMPLATE,
    META_TOKEN: process.env.META_TOKEN || '',
    CORS_PROXY: process.env.CORS_PROXY || '',
    API_VERSION: process.env.npm_package_version || 'Indefinida | error de compilacion'
  },

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/fetchtimeout',
    '~/plugins/role',
    '~/plugins/telegram',
    '~/plugins/check-internet-connection.js'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
    'nuxt-webpack-optimisations'
  ],
  pwa: {
    meta: {
      name: 'ARNOProducciones API',
      viewport: 'width=device-width, initial-scale=1',
      author: 'Nicolas Echeverry',
      description: 'Aplicativo de Gestion de la Informacion de ARNOP'
    },
    manifest: {
      name: 'ARNOProducciones API',
      lang: 'es',
      short_name: 'ARNOP API',
      start_url: '/',
      display: 'standalone'
    },
    icon: {
      fileName: 'icon.png',
      sizes: [16, 120, 144, 152, 192, 384, 512]
    }
  },

  webpackOptimisations: {
    features: {
      // enable risky optimisations in dev only
      hardSourcePlugin: process.env.NODE_ENV !== 'production',
      parallelPlugin: process.env.NODE_ENV !== 'production'
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/toast',
    'vue-web-cam/nuxt'
  ],
  toast: {
    position: 'bottom-center'
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    optimizeCSS: true,
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    }
  }
}
