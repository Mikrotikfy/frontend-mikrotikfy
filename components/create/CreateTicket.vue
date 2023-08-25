<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :text="!filled"
          :x-small="!filled"
          :class="filled ? 'rounded-xl black--text mr-2' : ''"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-comment-plus-outline</v-icon>
        </v-btn>
      </template>
      <span>Crear Ticket</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      fullscreen
    >
      <v-card class="ticketCard" width="90%">
        <v-card-title>
          <v-spacer />
          <v-btn
            icon
            class="transparent"
            @click="modal = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-row class="mx-0 px-5">
          <v-col cols="12" md="6" lg="5">
            <v-card
              :loading="loading"
              class="rounded-xl"
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
              <v-card-title>
                Crear Ticket de {{ clienttype.name }} <v-icon class="ml-2">{{ clienttype.icon }}</v-icon>
              </v-card-title>
              <div v-if="!loading">
                <v-card-text>
                  <v-autocomplete
                    v-model="ticketPayload.type"
                    :items="tickettypes"
                    item-text="name"
                    item-value="id"
                    label="¿Qué describe mejor el caso?"
                    auto-select-first
                    outlined
                    return-object
                    hide-details="auto"
                    :error="errors.type"
                    @focus="errors.type = false, alertBox = false"
                  />
                </v-card-text>
                <v-card-text v-if="ticketPayload.type.name === 'TRASLADO'">
                  <p>Direccion de desconexion (Autogenerada)</p>
                  <v-row class="mb-2">
                    <v-col cols="6">
                      <v-text-field
                        :value="client.addresses.length > 0 ? client.addresses.at(-1).address : client.address"
                        label="#"
                        outlined
                        dense
                        hide-details
                        disabled
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        :value="client.addresses.length > 0 ? client.addresses.at(-1).neighborhood : client.neighborhood"
                        item-text="name"
                        item-value="id"
                        :items="neighborhoods"
                        label="Barrio"
                        auto-select-first
                        outlined
                        dense
                        disabled
                        hide-details
                        return-object
                      />
                    </v-col>
                  </v-row>
                  <p>Direccion de Traslado</p>
                  <div class="my-5 parent">
                    <v-select
                      v-model="cx.dir1"
                      :items="cx.dirFragment1"
                      label="Dirección"
                      autocomplete="off"
                      outlined
                      dense
                      hide-details
                    />
                    <v-autocomplete
                      v-model="cx.dir2"
                      label="#"
                      placeholder="5, 10, etc..."
                      autocomplete="off"
                      :items="numbers"
                      outlined
                      dense
                      hide-details
                    />
                    <v-autocomplete
                      v-model="cx.dir3"
                      label="Adicional"
                      placeholder="BIZ, APTO, etc..."
                      autocomplete="off"
                      :items="[
                        'A',
                        'B',
                        'C',
                        'W',
                        'D',
                        'E',
                        'F',
                        'G',
                        'H',
                        'I',
                        'J',
                        'K',
                        'L',
                        'M',
                        'N',
                        'BIZ',
                        'APTO',
                        'CASA',
                        'EDIFICIO',
                        'TORRE',
                        'INTERIOR',
                        'OFICINA',
                        'LOCAL',
                        'PISO',
                        'MANZANA',
                        'LOTE',
                        'KM',
                        'VEREDA',
                        'FINCA',
                        'PARCELA',
                        'BODEGA'
                      ]"
                      outlined
                      dense
                      hide-details
                    />
                    <v-select
                      v-model="cx.dir4"
                      :items="cx.dirFragment2"
                      autocomplete="off"
                      label="#"
                      value="No."
                      outlined
                      dense
                      hide-details
                    />
                    <v-autocomplete
                      v-model="cx.dir5"
                      label="#"
                      placeholder="5, 10, etc..."
                      autocomplete="off"
                      :items="numbers"
                      outlined
                      dense
                      hide-details
                    />
                    <v-autocomplete
                      v-model="cx.dir6"
                      label="Adicional"
                      placeholder="BIZ, APTO, etc..."
                      autocomplete="off"
                      :items="[
                        'A',
                        'B',
                        'C',
                        'W',
                        'D',
                        'E',
                        'F',
                        'G',
                        'H',
                        'I',
                        'J',
                        'K',
                        'L',
                        'M',
                        'N',
                        'BIZ',
                        'APTO',
                        'CASA',
                        'EDIFICIO',
                        'TORRE',
                        'INTERIOR',
                        'OFICINA',
                        'LOCAL',
                        'PISO',
                        'MANZANA',
                        'LOTE',
                        'KM',
                        'VEREDA',
                        'FINCA',
                        'PARCELA',
                        'BODEGA'
                      ]"
                      outlined
                      dense
                      hide-details
                    />
                    <v-autocomplete
                      v-model="cx.dir7"
                      label="#"
                      placeholder="5, 10, etc..."
                      autocomplete="off"
                      :items="numbers"
                      outlined
                      dense
                      hide-details
                    />
                    <v-text-field
                      v-model="cx.dir8"
                      label="Opcional"
                      placeholder="APTO 101, MANZANA 5, etc..."
                      autocomplete="off"
                      outlined
                      dense
                      hide-details
                    />
                  </div>
                  <v-row class="align-center">
                    <h5 class="ml-4">
                      Así va quedando la dirección:
                    </h5>
                    <h4 class="ml-2 px-3 grey darken-3 text-weight-bold rounded-xl white--text">
                      {{ address }}
                    </h4>
                    <v-btn x-small class="ml-2 red darken-4" @click="resetAddress">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
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
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="phoneUpdate"
                        label="Actualizar celular (Opcional)"
                        outlined
                        dense
                        hide-details
                        :rules="phoneUpdate ? phoneRules : []"
                        append-icon="mdi-cellphone"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text v-if="ticketPayload.type.name === 'CAMBIO DE CONTRASEÑA'">
                  <v-text-field
                    v-model="ticketPayload.details"
                    :rules="valid_new_password"
                    label="Ingresa la nueva clave que desea el cliente"
                    :hide-details="hideHint"
                    outlined
                    @keyup="hideHint = false"
                  />
                </v-card-text>
                <v-card-text v-if="ticketPayload.type.name !== 'TRASLADO' && ticketPayload.type.name !== 'CAMBIO DE CONTRASEÑA'">
                  <v-textarea
                    v-model="ticketPayload.details"
                    outlined
                    label="Detalles del caso"
                    placeholder="El router se encuentra bloqueado o fuera de linea desde..."
                    :error="errors.details"
                    @focus="errors.details = false, alertBox = false"
                  />
                  <v-text-field
                    v-model="phoneUpdate"
                    label="Actualizar celular (Opcional)"
                    outlined
                    dense
                    hide-details
                    :rules="phoneUpdate ? phoneRules : []"
                    append-icon="mdi-cellphone"
                  />
                  <div class="d-flex">
                    <v-col>
                      <p class="text-h6">Canal de reporte</p>
                      <v-radio-group
                        v-model="ticketPayload.channel"
                        :error="errors.channel"
                      >
                        <v-radio
                          label="Telefónico"
                          value="phone"
                          @change="errors.channel = false, alertBox = false"
                        />
                        <v-radio
                          label="En Oficina"
                          value="office"
                          @change="errors.channel = false, alertBox = false"
                        />
                        <v-radio
                          label="Whatsapp"
                          value="whatsapp"
                          @change="errors.channel = false, alertBox = false"
                        />
                        <v-radio
                          label="Correo Electronico"
                          value="email"
                          @change="errors.channel = false, alertBox = false"
                        />
                        <v-radio
                          label="Otro"
                          value="other"
                          @change="errors.channel = false, alertBox = false"
                        />
                      </v-radio-group>
                    </v-col>
                  </div>
                </v-card-text>
              </div>
              <v-card-text class="d-flex">
                <v-btn
                  color="blue darken-4"
                  class="rounded-xl"
                  x-large
                  :loading="loading"
                  :disabled="loading"
                  @click="ticketPayload.type.requiresvisit ? testClientAvailable() : createTicket()"
                >
                  Crear Caso
                </v-btn>
                <v-spacer />

                <v-btn
                  text
                  class="rounded-xl"
                  x-large
                  @click="modal = false"
                >
                  Cancelar el caso
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="7">
            <MiscTicketHistoryTicket
              :clientid="client.id"
              :name="client.name"
            />
          </v-col>
        </v-row>
      </v-card>
      <v-dialog
        v-model="clientAvailableDialog"
        transition="dialog-bottom-transition"
        max-width="1100"
      >
        <v-card>
          <v-card-title>
            <h3 class="green--title darken-4 mt-4">¿Se encuentra el usuario disponible en la vivienda para atender al equipo técnico en el momento?</h3>
          </v-card-title>
          <v-card-actions>
            <v-btn
              class="red darken-4 mr-2"
              :disabled="!clientAvailable"
              @click="createTicket()"
            >
              Si, crear ticket
            </v-btn>
            <v-btn
              text
              class="mr-2"
              :disabled="!clientAvailable"
              @click="clientAvailable = !clientAvailable"
            >
              No, agendar a otra hora
            </v-btn>
            <v-text-field
              v-if="!clientAvailable"
              v-model="clientAvailableHour"
              outlined
              dense
              style="max-width: 300px;"
              hide-details="auto"
              label="Escribe la hora de visita"
              class="mr-2"
            />
            <v-btn
              v-if="clientAvailableHour !== ''"
              class="blue darken-4 mr-2"
              @click="createTicket()"
            >
              Continuar y crear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    },
    block: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    alertBox: false,
    phoneUpdate: null,
    clientAvailable: true,
    clientAvailableHour: '',
    clientAvailableDialog: false,
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
      channel: null,
      assignated: '',
      reboot: false,
      network: false,
      on: false
    },
    phoneRules: [
      (value) => {
        const pattern = /^[0-9]+$/
        return pattern.test(value) || 'El celular solo puede contener numeros'
      }
    ],
    cx: {
      neighborhood: {},
      dir1: '',
      dir2: '',
      dir3: '',
      dir4: 'No.',
      dir5: '',
      dir6: '',
      dir7: '',
      dir8: '',
      dir9: '',
      dirFragment1: [
        '(SIN INICIAL)',
        'CARRERA',
        'CALLE',
        'MANZANA',
        'DIAGONAL'
      ],
      dirFragment2: [
        'No.',
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
    },
    address () {
      return `${this.cx.dir1} ${this.cx.dir2}${this.cx.dir3} ${this.cx.dir4} ${this.cx.dir5}${this.cx.dir6} ${this.cx.dir7 !== '' ? '-' : ''} ${this.cx.dir7} ${this.cx.dir8}`
    },
    numbers () {
      return Array.from({ length: 1200 }, (_, i) => i + 1)
    }
  },
  methods: {
    async lastTicketIsOpenAndSameType () {
      const ticket = await this.$store.dispatch('ticket/getClientLastTicket', {
        clientId: this.client.id,
        token: this.$store.state.auth.token
      })
      if ((ticket && ticket.active) && (ticket.tickettype.id === this.ticketPayload.type.id)) {
        return true
      } else {
        return false
      }
    },
    isEmpty (obj) {
      return Object.keys(obj).length === 0
    },
    cxGenAddress () {
      this.cx.finalAddress = `${this.address} | ${this.cx.neighborhood.name}`
    },
    resetAddress () {
      this.cx.dir1 = ''
      this.cx.dir2 = ''
      this.cx.dir3 = ''
      this.cx.dir4 = 'No.'
      this.cx.dir5 = ''
      this.cx.dir6 = ''
      this.cx.dir7 = ''
      this.cx.dir8 = ''
      this.cx.dir9 = ''
    },
    initComponent () {
      if (this.client.phone !== '0' && this.client.phone !== '') {
        this.modal = true
      } else {
        this.$toast.error('El cliente no tiene un celular registrado', { duration: 5000 })
      }
      this.ticketPayload.client = this.client.id
      this.ticketPayload.city = this.client.city.id
      this.ticketPayload.assignated = this.assignated
    },
    testClientAvailable () {
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
      if (this.ticketPayload.channel === null && (this.ticketPayload.type && this.ticketPayload.type.name !== 'TRASLADO')) {
        this.alertBox = true
        this.alertBoxColor = 'red darken-4'
        this.createdMessage = 'Por favor especifica el canal de reporte del ticket antes de continuar'
        this.loading = false
        this.errors.channel = true
        return
      }
      this.clientAvailableDialog = true
    },
    async createTicket () {
      this.loading = true
      if (this.phoneUpdate) {
        const phone = this.phoneUpdate
        const res = await this.$store.dispatch('client/updateClientPhone', {
          token: this.$store.state.auth.token,
          client: this.client,
          phone
        })
        if (res.status === 200) {
          this.$toast.info('El celular del cliente ha sido actualizado', { duration: 5000 })
          this.$store.dispatch('client/getUsersFromDatabaseBySearch', { search: this.$route.params.search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token, pagination: { page: 1, pageSize: 500 } })
        } else {
          this.$toast.error('Ha ocurrido un error al actualizar el celular del cliente')
        }
      }
      if (this.ticketPayload.type.name === 'TRASLADO') {
        this.ticketPayload.details = `DX: ${this.getSecondFromLastAddress(this.client)} ${this.getSecondFromLastAddressNeighborhood(this.client)} \n CX: ${this.cx.finalAddress}`
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
      if (this.ticketPayload.channel === null && (this.ticketPayload.type && this.ticketPayload.type.name !== 'TRASLADO')) {
        this.alertBox = true
        this.alertBoxColor = 'red darken-4'
        this.createdMessage = 'Por favor especifica el canal de reporte del ticket antes de continuar'
        this.loading = false
        this.errors.channel = true
        return
      }
      if (this.clientAvailableHour !== '') {
        this.ticketPayload.details = `Cliente disponible desde las ${this.clientAvailableHour}\n${this.ticketPayload.details}`
      }
      if (await this.lastTicketIsOpenAndSameType()) {
        this.alertBox = true
        this.alertBoxColor = 'red darken-4'
        this.createdMessage = 'El cliente tiene un ticket abierto, por favor cierra el ticket antes de continuar'
        this.loading = false
        this.$toast.error('El cliente tiene un ticket abierto, por favor cierra el ticket antes de continuar', { duration: 5000 })
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
            channel: this.ticketPayload.type && this.ticketPayload.type.name === 'TRASLADO' ? 'office' : this.ticketPayload.channel,
            reboot: this.ticketPayload.reboot,
            network: this.ticketPayload.network,
            on: this.ticketPayload.on,
            city: this.ticketPayload.city,
            tickettype: this.ticketPayload.type.id,
            clienttype: this.clienttype.id,
            assignated: this.ticketPayload.assignated,
            details: this.ticketPayload.details
          }
        })
      }).then((input) => {
        if (input.status === 200) {
          if (this.ticketPayload.type.name === 'TRASLADO') {
            this.$store.dispatch('address/addAddress', {
              client: this.client,
              address: this.address,
              neighborhood: this.cx.neighborhood,
              token: this.$store.state.auth.token
            })
          }
          this.modal = false
          this.loading = false
          if (this.$route.query.clienttype === 'INTERNET') {
            this.$simpleTelegramCreateTicket({ client: this.client, tickettype: this.ticketPayload.type.name, details: this.ticketPayload.details, neighborhood: this.client.neighborhood, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
            // this.$pushSend({ title: 'TICKET INTERNET', message: `Ticket ${this.ticketPayload.type.name} creado para ${this.client.name}` })
          } else {
            this.$simpleTelegramCreateTicketTV({ client: this.client, tickettype: this.ticketPayload.type.name, details: this.ticketPayload.details, neighborhood: this.client.neighborhood, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
            // this.$pushSend({ title: 'TICKET TELEVISION', message: `Ticket ${this.ticketPayload.type.name} creado para ${this.client.name}` })
          }
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
    getSecondFromLastAddress (client) {
      if (client.addresses.length > 1) {
        return client.addresses.at(-2).address
      }
      return client.address
    },
    getSecondFromLastAddressNeighborhood (client) {
      if (client.addresses.length > 1) {
        return client.addresses.at(-2).neighborhood.name
      }
      return client.neighborhood.name
    }
  }
}
</script>

<style scoped>
.ticketCard {
  color: rgba(255,255,255,0.65);
  background-color: #24292e;
  background-image: url('/star-bg.svg'),linear-gradient(#191c20, #1e1e1e 50%);
  background-repeat: no-repeat;
  background-position: center 0, 0 0, 0 0;
  background-size: cover;
}
.parent {
  display:grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
}
</style>
