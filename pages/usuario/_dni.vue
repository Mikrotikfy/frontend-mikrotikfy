<template>
  <v-container style="height:95vh;">
    <v-row class="justify-center">
      <v-col cols="12" md="7" xl="5">
        <v-card class="rounded-xl">
          <v-card-title v-if="!$route.params.dni">
            Consulta tu estado de cuenta
          </v-card-title>
          <v-divider v-if="!$route.params.dni" />
          <v-card-text>
            <v-text-field
              v-if="!$route.params.dni"
              v-model="dni"
              :rules="valid_dni"
              label="Ingresu tu cedula"
              filled
              rouned
              prepend-icon="mdi-account"
              hide-details="auto"
              @keyup.enter="searchAccount"
            />
          </v-card-text>
          <v-card-text class="d-flex justify-center pb-5">
            <v-btn
              :color="$route.params.dni ? 'yellow darken-4' : 'primary'"
              class="elevation-0 rounded-xl"
              x-large
              @click="searchAccount"
            >
              {{ $route.params.dni ? 'Volver a consultar' : 'Consultar' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="clients.length > 0" class="justify-center">
      <v-col cols="12" md="7" xl="5">
        <v-card class="rounded-xl">
          <v-card-title>
            Bienvenido, hemos encontrado tu información.
          </v-card-title>
          <v-card-text v-for="client in clients" :key="client.id">
            <div v-if="client.monthlybills.length > 0">
              <h3>{{ client.city.name }} - {{ client.name }}</h3>
              <p>{{ client.addresses ? client.addresses.at(-1).address + ' ' + client.addresses.at(-1).neighborhood.name : client.address }}</p>
              <v-chip
                v-for="bill in client.monthlybills"
                :key="bill.id"
                class="text-h6 mr-3 primary"
                :href="`${$config.CDN_STRAPI_ENDPOINT}${bill.path}`"
              >
                {{ bill.type === 'internet' ? 'INTERNET' : 'TELEVISION' }}
              </v-chip>
            </div>
            <div v-else>
              {{ client.city.name }} - {{ client.name }} no tiene estados de cuenta.
            </div>
            <v-divider class="mt-5" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else class="justify-center">
      <v-col cols="12" md="7" xl="5">
        <v-card class="rounded-xl">
          <v-card-title>
            No hemos encontrado información sobre este usuario.
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-card-text class="text-center">
        <p class="grey--text">
          &copy; ARNOProducciones S.A.S. | Desarrollado con tecnologías modernas de la web | Departamento de desarrollo de software
        </p>
      </v-card-text>
      <div style="width:150px;">
        <MainLogo />
      </div>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'ConsultBill',
  layout: 'outuser',
  data () {
    return {
      dni: '',
      clients: [],
      valid_dni: [
        value => !!value || 'Debes especificar la cedula',
        (value) => {
          const pattern = /^[A-Za-z0-9]+$/
          return pattern.test(value) || 'La cedula no debe llevar puntos ni otros caracteres que no sean numeros.'
        }
      ]
    }
  },
  mounted () {
    this.getAccount()
  },
  methods: {
    async getAccount () {
      this.clients = await this.$store.dispatch('client/getByDni', {
        dni: this.$route.params.dni
      })
    },
    async searchAccount () {
      if (this.dni === '') {
        this.$router.push({ path: '/usuario/' })
      }
      if (this.dni !== this.$route.params.dni) {
        this.$router.push({ path: `/usuario/${this.dni}` })
      }
      this.clients = await this.$store.dispatch('client/getByDni', {
        dni: this.dni
      })
    }
  },
  head () {
    return {
      title: 'Consulta estado de cuenta'
    }
  }
}
</script>
