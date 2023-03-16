import path from 'path'
import fs from 'fs'
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

  server: process.env.NODE_ENV !== 'production' ? {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost.key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem'))
    }
  } : {},

  publicRuntimeConfig: {
    API_STRAPI_ENDPOINT: process.env.API_STRAPI_ENDPOINT || 'http://localhost:1337/api/',
    CDN_STRAPI_ENDPOINT: process.env.CDN_STRAPI_ENDPOINT || 'http://localhost:1337',
    META_ENDPOINT: process.env.NODE_ENV === 'production' ? process.env.META_PROD_ENDPOINT : process.env.META_DEV_ENDPOINT,
    META_TEMPLATE: process.env.NODE_ENV === 'production' ? process.env.META_PROD_TEMPLATE : process.env.META_DEV_TEMPLATE,
    META_TOKEN: process.env.META_TOKEN || '',
    CORS_PROXY: process.env.CORS_PROXY || ''
  },

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/role',
    '~/plugins/telegram',
    '~/plugins/push'
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
    '@nuxtjs/pwa'
  ],
  pwa: {
    workbox: {
      offlineStrategy: 'StaleWhileRevalidate',
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/(localhost:3000|admin\.arnoproducciones\.com)/,
          handler: 'StaleWhileRevalidate',
          method: 'GET',
          strategyOptions: {
            cacheName: 'api-cache-SWV'
          }
        }
      ]
    },
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
      // Note: just an example of keys, these are all keys and their default
      debug: true,
      postcssNoPolyfills: true,
      esbuildLoader: true,
      esbuildMinifier: true,
      imageFileLoader: true,
      webpackOptimisations: true,
      cacheLoader: true,
      hardSourcePlugin: false,
      parallelPlugin: false
    }
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.API_ENDPOINT,
        authenticationType: 'Bearer',
        tokenName: 'token'
      }
    }
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/onesignal',
    '@nuxtjs/toast'
  ],
  oneSignal: {
    init: {
      appId: '2b515757-2bd9-49a3-8f7f-81f730c120ca',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      }
    }
  },
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
