<template>
  <div>
    <v-tooltip v-if="!item.active" left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :color="item.active ? 'green darken-4' : 'red darken-3'"
          dark
          small
          :loading="item.loading"
          :disabled="item.loading"
          v-bind="attrs"
          text
          v-on="on"
          @click="modal = true"
        >
          <v-icon>mdi-{{ item.active ? 'check' : 'close' }}</v-icon>
        </v-btn>
      </template>
      <span>Solicitar Activacion</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="590"
    >
      <v-card
        :loading="loading"
      >
        <v-alert
          v-if="error"
          dense
          outlined
          type="error"
        >
          {{ errorMessage }}
        </v-alert>
        <v-card-title class="headline">
          Solicitar Activación de {{ item.name }}
        </v-card-title>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            :loading="loading"
            :disabled="loading"
            @click="createActivationrequest()"
          >
            Enviar Solicitud
          </v-btn>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="modal = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      flag1: false,
      flag2: false,
      modal: false,
      showControls: false,
      error: false,
      errorMessage: '',
      loading: false,
      validateLengh: [
        value => !!value || 'Este campo no puede estar vacío'
      ]
    }
  },
  computed: {
    currentCity () {
      return this.$store.state.cities.find(city => city.name === this.$route.query.city)
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  methods: {
    async createActivationrequest () {
      this.loading = true
      await this.testFields()
      await this.testDuplicates()
      try {
        if (this.flag1 && this.flag2) {
          await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${this.item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$store.state.auth.token}`
            },
            body: JSON.stringify({
              data: {
                hasPendingRx: true
              }
            })
          })
            .then(res => res.json())
            .then((activationrequest) => {
              if (activationrequest.data) {
                this.modal = false
                this.error = false
                this.loading = false
                this.$toast.success('Solicitud enviada con exito', { duration: 4000, position: 'top-center' })
                this.$simpleTelegramCreateRequest({ client: this.item, telegramBots: this.telegramBots, operator: this.$store.state.auth.username })
              } else {
                this.loading = false
                this.$toast.error('Error de red, reporta esto a nico.', { position: 'top-center' })
              }
            })
        }
      } catch (error) {
        this.$toast.error(error, { position: 'top-center' })
      }
    },
    resetErrorFields () {
      this.error = false
      this.errorMessage = ''
      this.showControls = false
    },
    async testFields () {
      const qs = require('qs')
      const query = qs.stringify({
        populate: [
          'technology',
          'mac_addresses'
        ]
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${this.item.id}?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((clients) => {
          clients = clients.data
          if (clients.mac_addresses.length < 1 || Object.keys(clients.technology).length === 0 || !clients.nap_onu_address || !clients.opticalPower) {
            this.loading = false
            this.$toast.error('No puedes enviar una solicitud de activacion hasta no haber llenado los campos de NAP, Potencia Optica y haber registrado la MAC correspondiente al cliente', { position: 'top-center' })
            this.showControls = true
          } else {
            this.loading = false
            this.flag1 = true
          }
        })
    },
    async testDuplicates () {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${this.item.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then((res) => { return res.json() })
        .then((activationRequestExists) => {
          if (activationRequestExists.data.hasPendingRx) {
            this.loading = false
            this.$toast.error('Ya existe una solicitud de activación', { position: 'top-center' })
          } else {
            this.loading = false
            this.flag2 = true
          }
        })
    }
  }
}
</script>
