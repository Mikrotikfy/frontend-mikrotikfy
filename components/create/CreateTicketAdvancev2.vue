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
          :client="ticket.client"
        />
        <NapRemoveDialog
          v-if="ticket.client.naps.length > 0 && ticket.tickettype.name === 'TRASLADO'"
          :ticketindex="ticketindex"
          :isticket="true"
          :client="ticket.client"
          :block="true"
        />
        <NapManageClient
          :isticket="true"
          :ticketindex="ticketindex"
          :client="ticket.client"
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
          :color="closeticket ? 'red darken-4' : 'blue darken-4'"
          block
          :loading="loading"
          :diabled="loading"
          class="rounded-xl"
          @click="createAdvance"
        >
          {{ closeticket ? technicianescalated ? 'Cerrar Ticket' : 'Cerrar Ticket' : technicianescalated ? 'Escalar caso' : 'Crear Avance' }}
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
      return this.$store.state.tv.spectypes
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
      const hasSpecs = this.ticket.client.tvspec
      if (hasSpecs) {
        this.specs = { ...this.ticket.client.tvspec }
        delete this.specs.id
        this.specsString = JSON.stringify(this.specs)
      }
    },
    setOpticalPower () {
      this.opticalpower = this.ticket.client.opticalpower
    },
    async setNewSpecs (ticketdetail) {
      if (this.specsString !== JSON.stringify(this.specs) && this.$route.query.clienttype === 'TELEVISION') {
        await this.$store.dispatch('tv/saveSpecs', {
          token: this.$store.state.auth.token,
          client: this.ticket.client,
          ticketdetail,
          ticket: this.ticket,
          specs: this.specs
        })
      }
    },
    async createAdvance () {
      if (this.details.length < 1) {
        this.$toast.error('Debes escribir un resumen del caso', { duration: 3000 })
        return
      }

      if (this.$route.query.clienttype === 'TELEVISION' && this.$isTechnician()) {
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

      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets/${this.ticket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: { active: !this.closeticket, escalated: this.technicianescalated, escalatedoffice: this.officeescalated, answered: true }
        })
      }).then(async (input) => {
        if (input.status === 200) {
          await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${this.ticket.client.id}`, {
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
              if (this.$route.query.clienttype === 'INTERNET') {
                this.$simpleTelegramCreateTicketAdvance({
                  ticket: this.ticket,
                  client: this.ticket.client,
                  status: this.closeticket,
                  details: this.details,
                  operator: this.$store.state.auth.username,
                  telegramBots: this.telegramBots
                })
              } else {
                this.$simpleTelegramCreateTicketAdvanceTv({
                  ticket: this.ticket,
                  client: this.ticket.client,
                  status: this.closeticket,
                  details: this.details,
                  operator: this.$store.state.auth.username,
                  telegramBots: this.telegramBots,
                  specs: this.specs
                })
              }
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
              await this.$store.dispatch('ticket/getTicketsFromDatabase', {
                city: this.$route.query.city,
                clienttype: this.$route.query.clienttype,
                token: this.$store.state.auth.token,
                active: false,
                retired: false
              })
              this.$toast.success('Ticket Actualizado con Exito', { duration: 4000, position: 'bottom-center' })
            })
            .catch((error) => {
              this.$toast.error(error, { duration: 5000, position: 'bottom-center' })
              console.log(error)
              this.loading = false
            })
        }
      }).catch((error) => {
        this.$toast.error(error, { position: 'bottom-center' })
      })
    }
  }
}
</script>

<style>

</style>
