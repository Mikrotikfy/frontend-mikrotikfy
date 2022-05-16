<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          mdi-plus
        </v-icon>
      </template>
      <span>Crear Ticket</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="590"
    >
      <v-card
        :loading="loading"
      >
        <v-alert
          v-if="alertBox"
          type="info"
          :class="alertBoxColor"
          tile
          dismissible
        >
          {{ createdMessage }}
        </v-alert>
        <v-card-title class="headline">
          Crear Ticket de {{ clienttype.name }} <v-icon class="ml-2">{{ clienttype.icon }}</v-icon>
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <v-select
              v-model="ticketPayload.type"
              :items="tickettypes"
              item-text="name"
              item-value="id"
              label="Problema"
              outlined
              return-object
              :error="errors.type"
              @focus="errors.type = false, alertBox = false"
            />
          </v-card-text>
          <v-card-text v-if="ticketPayload.type.name === 'TRASLADO'">
            <p>Direccion de desconexion (Autogenerada)</p>
            <v-row class="mb-2">
              <v-col cols="6">
                <v-text-field
                  v-model="client.address"
                  label="#"
                  outlined
                  dense
                  hide-details
                  disabled
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-model="client.neighborhood"
                  item-text="name"
                  item-value="id"
                  :items="neighborhoods"
                  label="Barrio"
                  outlined
                  dense
                  disabled
                  hide-details
                  return-object
                />
              </v-col>
            </v-row>
            <p>Direccion de Traslado</p>
            <v-row class="mb-2">
              <v-col cols="6" lg="3" md="3">
                <v-select
                  v-model="cx.dir1"
                  :items="cx.dirFragment1"
                  label="Dirección"
                  outlined
                  dense
                  hide-details
                  @change="cxGenAddress"
                />
              </v-col>
              <v-col cols="6" lg="3" md="3">
                <v-text-field
                  v-model="cx.dir2"
                  label="#"
                  outlined
                  dense
                  hide-details
                  @change="cxGenAddress"
                />
              </v-col>
              <v-col cols="6" lg="3" md="3">
                <v-select
                  v-model="cx.dir3"
                  :items="cx.dirFragment2"
                  label="#"
                  value="#"
                  outlined
                  dense
                  hide-details
                  @change="cxGenAddress"
                />
              </v-col>
              <v-col cols="6" lg="3" md="3">
                <v-text-field
                  v-model="cx.dir4"
                  label="#"
                  outlined
                  dense
                  hide-details
                  @change="cxGenAddress"
                />
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col>
                <v-autocomplete
                  v-model="cx.neighborhood"
                  item-text="name"
                  item-value="id"
                  :items="neighborhoods"
                  label="Barrio"
                  outlined
                  dense
                  hide-details
                  return-object
                  @change="cxGenAddress"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-text-field
              v-if="ticketPayload.type.name === 'CAMBIO DE CONTRASEÑA'"
              v-model="ticketPayload.details"
              :rules="valid_new_password"
              label="Ingresa la nueva clave que desea el cliente"
              :hide-details="hideHint"
              outlined
              @keyup="hideHint = false"
            />
          </v-card-text>
          <v-card-text>
            <v-textarea
              v-if="ticketPayload.type.name !== 'TRASLADO' && ticketPayload.type.name !== 'CAMBIO DE CONTRASEÑA'"
              v-model="ticketPayload.details"
              outlined
              label="Detalles del ticket"
              :error="errors.details"
              @focus="errors.details = false, alertBox = false"
            />
          </v-card-text>
        </div>
        <v-card-actions>
          <v-btn
            color="blue darken-4"
            :loading="loading"
            :disabled="loading"
            @click="createTicket()"
          >
            Crear Ticket
          </v-btn>
          <v-spacer />

          <v-btn
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'CreateTicket',
  props: {
    client: {
      type: Object,
      default: () => {}
    },
    assignated: {
      type: Number,
      default: -1
    },
    role: {
      type: Array,
      default: () => {}
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    alertBox: false,
    alertBoxColor: '',
    createdMessage: '',
    errors: {
      type: false,
      details: false
    },
    ticketPayload: {
      client: '',
      type: {},
      details: '',
      city: '',
      assignated: ''
    },
    cx: {
      neighborhood: {},
      dir1: '',
      dir2: '',
      dir3: '#',
      dir4: '',
      dirFragment1: [
        '(SIN INICIAL)',
        'CARRERA',
        'CALLE',
        'MANZANA',
        'DIAGONAL'
      ],
      dirFragment2: [
        '#',
        'CASA',
        'DIAGONAL',
        'LOTE'
      ],
      finalAddress: ''
    },
    valid_new_password: [
      value => !!value || 'Debes especificar la nueva contraseña deseada.',
      value => (value || '').length >= 8 || 'La clave debe tener al menos 8 caracteres.',
      (value) => {
        const pattern = /^[A-Za-z0-9]+$/
        return pattern.test(value) || 'La contraseña no puede contener caracteres especiales.'
      }
    ],
    hideHint: true
  }),
  computed: {
    neighborhoods () {
      return this.$store.state.neighborhoods
    },
    clienttype () {
      return this.$store.state.clienttypes.find(ct => ct.name === this.$route.query.clienttype)
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    tickettypes () {
      return this.$store.state.ticket.tickettypes
    }
  },
  methods: {
    isEmpty (obj) {
      return Object.keys(obj).length === 0
    },
    cxGenAddress () {
      this.cx.finalAddress = `${this.cx.dir1} ${this.cx.dir2} ${this.cx.dir3} ${this.cx.dir4} | ${this.cx.neighborhood.name}`
    },
    initComponent () {
      this.modal = true
      this.ticketPayload.client = this.client.id
      this.ticketPayload.city = this.client.city.id
      this.ticketPayload.assignated = this.assignated
    },
    async createTicket () {
      this.loading = true
      if (this.ticketPayload.type.name === 'TRASLADO') {
        this.ticketPayload.details = `DX: ${this.client.address} ${this.client.neighborhood.name} \n CX: ${this.cx.finalAddress}`
      }
      if (this.isEmpty(this.ticketPayload.type)) {
        this.alertBox = true
        this.alertBoxColor = 'red darken-4'
        this.createdMessage = 'Selecciona un tipo de ticket antes de continuar'
        this.loading = false
        this.errors.type = true
        return
      }
      if (this.ticketPayload.details === '') {
        this.alertBox = true
        this.alertBoxColor = 'red darken-4'
        this.createdMessage = 'Por favor especifica los detalles del ticket antes de continuar'
        this.loading = false
        this.errors.details = true
        return
      }
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: {
            active: true,
            client: this.ticketPayload.client,
            city: this.ticketPayload.city,
            tickettype: this.ticketPayload.type.id,
            clienttype: this.clienttype.id,
            assignated: this.ticketPayload.assignated,
            details: this.ticketPayload.details
          }
        })
      }).then((input) => {
        if (input.status === 200) {
          this.modal = false
          this.loading = false
          this.$simpleTelegramCreateTicket({ client: this.client, tickettype: this.ticketPayload.type.name, details: this.ticketPayload.details, neighborhood: this.client.neighborhood, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
        } else {
          this.alertBox = true
          this.alertBoxColor = 'red darken-4'
          this.createdMessage = 'Error al crear el ticket'
          this.loading = false
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    },
    can (component) {
      // eslint-disable-next-line camelcase
      const allowed_components = this.role
      // eslint-disable-next-line camelcase
      const current_component = component
      return allowed_components.includes(current_component)
    }
  }
}
</script>

<style>

</style>
