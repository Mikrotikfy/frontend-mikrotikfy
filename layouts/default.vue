<template>
  <v-app
    class="text-body-2"
    :style="this.$vuetify.theme.dark ? 'background-color:rgb(20 20 20 / 68%);' : 'background-color:rgb(255 255 255 / 86%);'"
  >
    <v-navigation-drawer
      v-model="drawer"
      app
      :permanent="!isMobile"
      :expand-on-hover="!isMobile"
      :mini-variant="!isMobile"
      :bottom="isMobile"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menu"
          :key="i"
          :to="`${item.url}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.name" />
          </v-list-item-content>
          <v-list-item-action v-if="item.info">
            <v-chip color="red">
              {{ item.info }}
            </v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dense
      class="elevation-0 transparent"
    >
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="drawer = !drawer" />
      <v-btn
        v-for="clienttype in $store.state.auth.clienttypes"
        :key="clienttype.name"
        class="ml-2"
        :color="clienttype.name === $route.query.clienttype ? $vuetify.theme.dark ? 'blue darken-4 white--text' : 'blue darken-4' : 'white black--text'"
        elevation="0"
        rounded
        small
        :to="`${$route.path}?city=${$route.query.city}&clienttype=${clienttype.name}`"
      >
        <v-icon :class="isMobile ? '' : 'mr-2'">
          {{ clienttype.icon }}
        </v-icon>
        {{ isMobile ? null : clienttype.name }}
      </v-btn>
      <v-spacer />
      <v-switch
        v-model="light"
        :prepend-icon="light ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
        inset
        class="mt-5"
        @change="changeTheme()"
      />
      <div v-if="$store.state.auth">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              :class="$nuxt.isOffline ? 'red--text darken-4' : 'green--text darken-4'"
              v-bind="attrs"
              v-on="on"
            >
              mdi-account
            </v-icon>
          </template>
          <span>{{ $store.state.auth.username.charAt(0).toUpperCase() + $store.state.auth.username.slice(1) }}</span>
        </v-tooltip>
        <span class="mr-1 d-none d-xs-none d-sm-none d-md-inline d-lg-inline" style="font-size:0.7rem">{{ $store.state.auth.username.charAt(0).toUpperCase() + $store.state.auth.username.slice(1) }}</span>
        <v-btn
          v-for="city in $store.state.auth.cities"
          :key="city.name"
          class="ml-2"
          small
          :color="city.color"
          :to="`${$route.path}?city=${city.name}&clienttype=${$route.query.clienttype}`"
        >
          {{ isMobile ? city.name.charAt(0) : city.name }}
        </v-btn>
      </div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            large
            class="ml-2"
            v-bind="attrs"
            v-on="on"
            @click="logout(false)"
          >
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </template>
        <span>Cerrar sesión</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <v-alert
        v-if="$nuxt.isOffline"
        dense
        type="error"
      >
        Estas sin acceso a internet. Verifica la conexión WIFI o de datos.
      </v-alert>
      <nuxt />
    </v-main>
    <v-footer
      app
      inset
      absolute
      style="font-size:11px;"
      class="text-center justify-center"
    >
      <span
        class="text-center"
      >&copy; 2019 - {{ new Date().getFullYear() }} Base de Datos interactiva - Desarrollada para ARNOProducciones por Nicolas Echeverry - Todos los derechos reservados.</span>
    </v-footer>
  </v-app>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  middleware: ['defaultCity', 'authenticated'],
  data () {
    return {
      isMobile: false,
      light: null,
      hasPendingChanges: false,
      drawer: false,
      title: 'Aplicación de Gestión Dinámica ARNOP'
    }
  },
  computed: {
    cities () {
      return this.$store.state.cities
    },
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.name == this.$route.query.city) : ''
    },
    role () {
      return this.$store.state.auth.role.name
    },
    setCityTitle () {
      return this.currentCity ? `${this.$route.name.toUpperCase()} ${this.currentCity.name}` : this.title
    },
    menu () {
      return this.$store.state.auth.menu
    }
  },
  mounted () {
    this.testAuthToken()
    this.getLocalStorage()
    this.comprobeDateToSetChristmasTheme()
    this.loadThemeFromVuetifyThemeManager()
    this.isMobileScreen()
  },
  methods: {
    testAuthToken () {
      if (this.$store.state.auth.token) {
        this.$store.dispatch('authActions/checkToken', {
          token: this.$store.state.auth.token
        }).then((res) => {
          if (res.status !== 200) {
            this.logout(true)
          }
        })
      }
    },
    async getLocalStorage () {
      await this.$store.dispatch('loadLocalStorage')
    },
    loadThemeFromVuetifyThemeManager () {
      const currentTheme = localStorage.getItem('currentTheme')
      if (currentTheme) {
        if (currentTheme === 'dark') {
          this.light = false
          this.$vuetify.theme.dark = true
        } else {
          this.light = true
          this.$vuetify.theme.dark = false
        }
      } else {
        localStorage.setItem('currentTheme', 'dark')
      }
    },
    changeTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (this.$vuetify.theme.dark) {
        localStorage.setItem('currentTheme', 'dark')
      } else {
        localStorage.setItem('currentTheme', 'light')
      }
    },
    async restoreReset () {
      await this.$strapi.update('users', this.$store.state.auth.id, {
        resetSession: false
      })
    },
    setLocalStorage () {
      localStorage.setItem('currentCity', this.$route.query.city)
    },
    comprobeDateToSetChristmasTheme () {
      const date = new Date()
      const month = date.getMonth()
      if (month === 11) {
        this.bg = 'cbg.jpg'
      }
    },
    isMobileScreen () {
      const res = document.body.clientWidth
      if (res < 800) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    logout (params) {
      Cookie.remove('auth')
      Cookie.remove('token')
      localStorage.clear()
      sessionStorage.clear()
      this.$store.commit('setAuth', null)
      window.location.href = params ? '/login?sessionExpired=true' : '/login'
    }
  }
}
</script>
<style>
.secondary-city {
    background: #16312d;
    color: #fff;
}
body {
    color: rgba(255,255,255,0.65);
    background-color: #24292e;
    background-image: url('/star-bg.svg'),linear-gradient(#191c20, #1e1e1e 50%);
    background-repeat: no-repeat;
    background-position: center 0, 0 0, 0 0;
    background-size: cover;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(60, 60, 60);
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(41, 41, 41)
}
</style>
