<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="!$store.state.isDesktop"
    width="500"
  >
    <template v-slot:activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            :block="block"
            :text="!block"
            :x-small="!block"
            :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
            class="rounded-xl"
            :large="block"
            v-on="{ ...dialog, ...tooltip }"
            @click="initComponent()"
          >
            <v-icon>mdi-plus</v-icon>
            <span v-if="block">
              Crear Avance
            </span>
          </v-btn>
        </template>
        <span>Crear Avance</span>
      </v-tooltip>
    </template>

    <v-card>
      <v-card-title>
        <span>Crear Avance en Ticket {{ ticket.id }}</span>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="details"
          outlined
          class="mt-4"
          hide-details="auto"
          label="Observaciones detalladas"
        />
        <v-text-field
          v-if="$route.query.clienttype === 'INTERNET' && ticket.tickettype.requiresextrainfo"
          v-model.number="opticalpower"
          label="Potencia Óptica en dBm"
          prepend-inner-icon="mdi-lan"
          class="mt-5"
          hide-details="auto"
          outlined
          type="number"
        />
      </v-card-text>
      <v-divider v-if="$route.query.clienttype === 'INTERNET' && ticket.tickettype.requiresextrainfo" class="mb-5" />
      <v-card-text v-if="$route.query.clienttype === 'INTERNET' && ticket.tickettype.requiresextrainfo">
        <NapActualInfo
          :service="ticket.service"
        />
        <NapRemoveDialog
          v-if="ticket.service.naps.length > 0 && ticket.tickettype.name === 'TRASLADO'"
          :ticketindex="ticket.id"
          :isticket="true"
          :service="ticket.service"
          :block="true"
        />
        <NapManageClient
          :isticket="true"
          :ticketindex="ticket.id"
          :service="ticket.service"
          :block="true"
        />
      </v-card-text>
      <v-divider v-if="$route.query.clienttype === 'TELEVISION' && ticket.tickettype.requiresextrainfo" class="mb-5" />
      <v-card-text v-if="$route.query.clienttype === 'TELEVISION'">
        <v-select
          v-model="specs.tvspectype"
          :items="tvSpecTypes"
          item-text="name"
          item-value="id"
          label="Calidad de señal"
          prepend-icon="mdi-signal"
          dense
          return-object
          class="mb-5"
          outlined
          hide-details
        />
        <v-row align="center" class="pa-3">
          <v-text-field
            v-model.number="specs.tvs"
            label="Televisores"
            prepend-icon="mdi-television"
            class="mb-5"
            type="number"
            :disabled="specs.notvs"
            outlined
            dense
            required
            hide-details="auto"
          />
          <v-checkbox
            v-model.number="specs.notvs"
            label="No se puede verificar"
            class="mb-5 ml-2 shrink mt-0"
            small
            required
            hide-details="auto"
          />
        </v-row>
        <v-text-field
          v-model.number="specs.high"
          label="Altos"
          prepend-icon="mdi-arrow-up-bold-box"
          class="mb-5"
          type="number"
          outlined
          dense
          hide-details="auto"
        />
        <v-text-field
          v-model.number="specs.down"
          label="Bajos"
          prepend-icon="mdi-arrow-down-bold-box"
          class="mb-5"
          type="number"
          dense
          outlined
          hide-details="auto"
        />
      </v-card-text>
      <v-divider />
      <v-card-text>
        <MiscSignature
          :key="ticket.id"
          :ticket="ticket"
          :ticketindex="ticketindex"
        />
        <MiscPhoto
          :key="ticket.id + 1"
          :ticket="ticket"
          :ticketindex="ticketindex"
        />
      </v-card-text>
      <v-divider />
      <v-card-text>
        <v-checkbox
          v-if="$isAdmin()"
          v-model="technicianescalated"
          color="red"
          label="Escalar a tecnico?"
          class="ml-2"
        />
        <v-checkbox
          v-if="$isAdmin()"
          v-model="officeescalated"
          color="red"
          label="Escalar a oficina?"
          class="ml-2"
        />
        <v-checkbox
          v-model="closeticket"
          color="red"
          label="Cerrar Ticket?"
          class="ml-2"
        />
        <v-btn
          :color="closeticket ? 'red darken-4' : 'primary'"
          block
          :loading="loading"
          :diabled="loading"
          class="rounded-xl"
          large
          @click="createAdvance"
        >
          <v-icon>{{ closeticket ? 'mdi-check' : 'mdi-plus' }}</v-icon>
          {{ closeticket ? technicianescalated ? 'Cerrar Ticket' : 'Cerrar Ticket' : technicianescalated || officeescalated ? 'Escalar caso' : 'Crear Avance' }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateTicketAdvanceV2',
  props: {
    ticketindex: {
      type: Number,
      required: true
    },
    ticket: {
      type: Object,
      default: () => {}
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false,
    stepper: 1,
    details: '',
    opticalpower: null,
    technicianescalated: false,
    officeescalated: false,
    closeticket: false,
    loading: false,
    specsString: '',
    specs: {
      tvspectype: null,
      db: null,
      high: null,
      down: null,
      tvs: null,
      notvs: false
    }
  }),
  computed: {
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    tvSpecTypes () {
      return this.$store.state.tvspectypes
    }
  },
  mounted () {
    this.testTvSpecs()
    this.setOpticalPower()
  },
  methods: {
    initComponent () {
      this.dialog = true
      this.stepper = 1
    },
    testTvSpecs () {
      const hasSpecs = this.ticket.service.tvspec
      if (hasSpecs) {
        this.specs = { ...this.ticket.service.tvspec }
        delete this.specs.id
        this.specsString = JSON.stringify(this.specs)
      }
    },
    setOpticalPower () {
      this.opticalpower = this.ticket.service.opticalpower
    },
    async setNewSpecs (ticketdetail) {
      if (this.specsString !== JSON.stringify(this.specs) && this.ticket.service.name === 'TELEVISION') {
        await this.$store.dispatch('tv/saveSpecs', {
          token: this.$store.state.auth.token,
          service: this.ticket.service,
          ticketdetail,
          ticket: this.ticket,
          specs: this.specs
        })
      }
    },
    generateMessage () {
      const ticket = this.ticket
      const service = this.ticket.service
      if (this.ticket.service.name === 'TELEVISION') {
        let line1 = ''
        if (this.closeticket) {
          line1 = '✅ CIERRE DE TICKET ✅'
        } else {
          line1 = '✴️ AVANCE DE TICKET ✴️'
        }
        const line2 = service.code
        const line3 = service.normalized_client.name
        const line4 = service.service_addresses ? service.service_addresses.at(-1) ? service.service_addresses.at(-1).address : 'Sin Direccion' : 'No especificado'
        const line5 = service.service_addresses ? service.service_addresses.at(-1) ? service.service_addresses.at(-1).neighborhood.name : 'Sin Barrio' : 'No especificado'
        const line6 = service.normalized_client.phone
        const line7 = ticket.tickettype.name
        const line8 = `Calidad de señal: ${this.specs.tvspectype ? this.specs.tvspectype.name : 'No especificado'}`
        const line10 = `Altos: ${this.specs.high ? this.specs.high : 'No especificado'}`
        const line11 = `Bajos: ${this.specs.down ? this.specs.down : 'No especificado'}`
        const line12 = `Televisores: ${this.specs.tvs ? this.specs.tvs : 'No especificado'}`
        const line13 = `Observaciones: ${this.details}`
        let line14 = ''
        if (this.closeticket) {
          line14 = 'CASO CERRADO'
        } else {
          line14 = 'CASO ACTIVO'
        }
        const line15 = this.$store.state.auth.username
        const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n\n${line8}\n${line10}\n${line11}\n${line12}\n\n${line13}\n\n${line14}\n${line15}`
        this.copyAdvanceCommentToClipBoard(message)
        return message
      } else {
        let line1 = ''
        if (this.closeticket) {
          line1 = '✅ CIERRE DE TICKET ✅'
        } else {
          line1 = '✴️ AVANCE DE TICKET ✴️'
        }
        const line2 = service.code
        const line3 = service.normalized_client.name
        const line4 = service.service_addresses.at(-1).address
        const line5 = service.service_addresses.at(-1).neighborhood.name
        const line6 = service.normalized_client.phone
        const line7 = `Potencia Optica: ${this.opticalpower ? this.opticalpower : 'No especificado'}${this.opticalpower ? 'dBm' : ''}`
        const line8 = ticket.tickettype.name
        const line9 = this.details
        let line10 = ''
        if (this.closeticket) {
          line10 = 'CASO CERRADO'
        } else {
          line10 = 'CASO ACTIVO'
        }
        const line11 = this.$store.state.auth.username
        const message = `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n${line8}\n${line9}\n\n${line10}\n${line11}`
        this.copyAdvanceCommentToClipBoard(message)
        return message
      }
    },
    copyAdvanceCommentToClipBoard (comment) {
      navigator.clipboard.writeText(comment)
    },
    async createAdvance () {
      if (this.details.length < 1) {
        this.$toast.error('Debes escribir un resumen del caso', { duration: 3000 })
        return
      }

      if (this.ticket.service.name === 'TELEVISION' && this.$isTechnician()) {
        if (this.closeticket && this.specs.quality === null) {
          this.$toast.error('Seleccione una calidad de señal', { duration: 3000 })
          return
        }
        if (((!this.specs.tvs || this.specs.tvs === 0 || this.specs.tvs === '') && this.closeticket && !this.specs.notvs)) {
          this.$toast.error('Ingrese la cantidad de televisores del usuario', {
            duration: 3000
          })
          return
        }
        if (this.closeticket && !this.specs.high) {
          this.$toast.error('Ingrese una medida de altos', {
            duration: 3000
          })
          return
        }
        if (this.closeticket && !this.specs.down) {
          this.$toast.error('Ingrese una medida de bajos', {
            duration: 3000
          })
          return
        }
      }
      this.loading = true
      const message = this.generateMessage()
      try {
        await this.fetchWithTimeout(`${this.$config.API_STRAPI_ENDPOINT}tickets/${this.ticket.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          },
          body: JSON.stringify({
            data: {
              active: !this.closeticket,
              escalated: this.technicianescalated,
              escalatedoffice: this.officeescalated,
              answered: true,
              opticalpower: this.ticket.service.opticalpower
            }
          })
        }).then(async (input) => {
          if (input.status === 200) {
            await fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${this.ticket.service.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.$store.state.auth.token}`
              },
              body: JSON.stringify({
                data: {
                  opticalpower: this.opticalpower
                }
              })
            })
            await fetch(`${this.$config.API_STRAPI_ENDPOINT}ticketdetails`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.$store.state.auth.token}`
              },
              body: JSON.stringify({
                data: {
                  ticket: this.ticket.id,
                  details: this.details,
                  operator: this.$store.state.auth.id
                }
              })
            }).then((input) => {
              if (input.status === 200) {
                this.dialog = false
                this.details = ''
                this.closeticket = false
                this.officeescalated = false
                this.technicianescalated = false
                this.loading = false
              }
              return input.json()
            })
              .then(async (res) => {
                await this.setNewSpecs(res.data)
                this.$emit('refreshTickets')
                this.$toast.success('Ticket Actualizado con Exito', { duration: 4000, position: 'bottom-center' })
                this.loading = false
                if (this.ticket.service.name === 'INTERNET') {
                  try {
                    this.$simpleTelegramCreateTicketAdvance({ message, telegramBots: this.telegramBots })
                  } catch (error) {
                    this.$toast.error('No se pudo enviar el mensaje a Telegram', { duration: 3000 })
                  }
                } else {
                  try {
                    this.$simpleTelegramCreateTicketAdvanceTv({ message, telegramBots: this.telegramBots })
                  } catch (error) {
                    this.$toast.error('No se pudo enviar el mensaje a Telegram', { duration: 3000 })
                  }
                }
              })
          }
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          this.$toast.info('La calidad de red es insuficiente. Intentalo de nuevo mas tarde.', { duration: 6000 })
        } else {
          this.$toast.error(error, { duration: 1000, position: 'bottom-center' })
        }
        this.loading = false
      }
    },
    async fetchWithTimeout (resource, options = {}) {
      const { timeout = 6000 } = options

      const controller = new AbortController()
      const id = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(resource, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(id)

      return response
    }
  }
}
</script>

<style>

</style>
