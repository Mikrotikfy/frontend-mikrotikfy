<template>
  <div>
    <v-card
      flat
      :loading="isLoading"
      class="rounded-xl"
      style="background-color: rgb(0,0,0,0.3); backdrop-filter: blur(5px);"
    >
      <v-alert
        v-if="firstTime"
        type="info"
        class="blue darken-4"
        tile
      >
        ARNOProducciones Database
      </v-alert>
      <v-alert
        v-if="loginFailed"
        type="error"
        tile
        class="rounded-t-xl"
      >
        Error de inicio de sesión. <br>
        <span class="text-subtitle-2">{{ errorMessages }}</span>
      </v-alert>
      <v-alert
        v-if="sessionExpired"
        class="yellow darken-4 rounded-t-xl"
        tile
      >
        Tu sesión ha expirado. Ingresa nuevamente.
      </v-alert>
      <v-alert
        v-if="loginSuccessful"
        type="info"
        tile
        class="rounded-t-xl"
      >
        ¡Inicio de sesión correcto! Por favor espere.
      </v-alert>
      <v-card-text
        class="d-flex justify-center"
      >
        <img
          src="logo.png"
          alt="ARNOProducciones Logo"
          style="max-width:50%;"
        >
      </v-card-text>
      <v-card-text class="text-center">
        <h3>Aplicativo de Gestión Integral</h3>
      </v-card-text>
      <v-card-text>
        <form @keyup.enter="login">
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            label="Usuario"
            class="rounded-xl"
            hide-details="auto"
            outlined
            required
          />
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            class="rounded-xl mt-4"
            hide-details="auto"
            outlined
            hint="Ingresa tu contraseña"
            required
            @click:append="showPassword = !showPassword"
          />
        </form>
      </v-card-text>
      <v-card-text>
        <v-btn
          tile
          text
          block
          class="blue darken-4 white--text rounded-xl"
          :loading="isLoading"
          :disabled="isLoading"
          @click.enter="login"
        >
          Continuar
          <v-icon>
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card-text class="text-center">
      <p class="grey--text">
        &copy; ARNOProducciones S.A.S. | Departamento de Desarrollo de Software
      </p>
    </v-card-text>
    <v-card-text class="text-center pt-0">
      <p class="grey--text">
        Nicolas Echeverry
      </p>
    </v-card-text>
  </div>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  data: () => ({
    username: '',
    usernameRules: [
      v => !!v || 'Usuario requerido',
      v => (v && v.length <= 32) || 'El nombre debe ser de menos de 32 caracteres de longitud.'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Debes ingresar una contraseña',
      v => (v && v.length >= 8) || 'La contraseña debe ser de almenos 8 caracteres.'
    ],
    showPassword: false,
    firstTime: false,
    loginFailed: false,
    loginSuccessful: false,
    isLoading: false,
    sessionExpired: false,
    errorMessages: ''
  }),
  mounted () {
    if (this.$route.query.firstTime) {
      this.firstTime = true
    }
    if (this.$route.query.loginFailed) {
      this.loginFailed = true
    }
    if (this.$route.query.sessionExpired) {
      this.sessionExpired = true
    }
  },
  methods: {
    clear () {
      this.username = ''
      this.password = ''
    },
    async login () {
      this.isLoading = true
      this.loginFailed = false
      this.clearSessionData()
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: this.username,
          password: this.password
        })
      }).then((login) => {
        if (login.status === 200) {
          Promise.resolve(login.json())
            .then((res) => {
              this.logininfo(res)
            })
        } else {
          this.loginFailed = true
          this.isLoading = false
          this.sessionExpired = false
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    },
    async logininfo (response) {
      this.loginSuccessful = true
      const qs = require('qs')
      const query = qs.stringify({
        populate: ['role', 'cities', 'cities.mikrotiks', 'clienttypes', 'menus', 'preferredcity', 'preferredclienttype']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}users/${response.user.id}?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${response.jwt}`
        }
      })
        .then(res => res.json())
        .then((userResponse) => {
          const userData = userResponse
          const userCities = userResponse.cities.map((city) => {
            return {
              id: city.id,
              name: city.name,
              color: city.color,
              requiresphone: city.requiresphone,
              mikrotiks: city.mikrotiks.map((mikrotik) => {
                return {
                  id: mikrotik.id,
                  name: mikrotik.name,
                  ip: mikrotik.ip
                }
              })
            }
          })
          const userClienttypes = userResponse.clienttypes.map((clienttype) => {
            return {
              id: clienttype.id,
              name: clienttype.name,
              icon: clienttype.icon
            }
          })
          const userMenus = userResponse.menus.map((menu) => {
            return {
              id: menu.id,
              name: menu.name,
              icon: menu.icon,
              url: menu.url,
              priority: menu.priority
            }
          })
          if (!userCities) {
            this.errorMessages = 'Ciudad no especificada para el usuario'
            this.loginFailed = true
            this.loginSuccessful = false
            this.isLoading = false
          } else {
            const auth = {
              id: userData.id,
              username: userData.username,
              preferredcity: userData.preferredcity,
              preferredclienttype: userData.preferredclienttype,
              cities: userCities,
              clienttypes: userClienttypes,
              menu: userMenus.sort((a, b) => a.priority - b.priority),
              role: userData.role,
              telegramchatid: userData.telegramchatid
            }
            const authCookie = {
              token: response.jwt
            }
            Cookie.set('auth', authCookie, { expires: 7, path: '/' })
            Cookie.set('authStandalone', authCookie, { expires: 7, path: '/standalone' })
            localStorage.setItem('auth', JSON.stringify(auth))
            const redirectPath = `/tickets?city=${userData && userData.preferredcity ? userData.preferredcity.name : userCities[0].name}&clienttype=${userData && userData.preferredclienttype ? userData.preferredclienttype.name : 'INTERNET'}&view=TODOS`
            window.location.href = redirectPath
            this.isLoading = false
          }
        }).catch((_) => {
          this.errorMessages = 'Usuario o contraseña incorrectos. Intente nuevamente.'
          this.loginFailed = true
          this.loginSuccessful = false
          this.isLoading = false
        })
    },
    clearSessionData () {
      Cookie.remove('auth')
      Cookie.remove('token')
      localStorage.clear()
      sessionStorage.clear()
      this.$store.commit('setAuth', null)
      caches.delete(`arnop-api-precache-${this.$config.API_VERSION}`)
      caches.delete(`arnop-api-runtime-cache-${this.$config.API_VERSION}`)
    }
  }
}
</script>

<style>

</style>
