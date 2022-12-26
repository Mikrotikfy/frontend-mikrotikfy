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
        <span class="headline">Crear Avance en Ticket</span>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-stepper
        v-model="stepper"
        vertical
        class="transparent"
      >
        <v-stepper-step
          :complete="stepper > 1"
          step="1"
          editable
        >
          Resumen del caso
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-textarea
            v-model="details"
            outlined
            class="mt-4"
            hide-details="auto"
            label="Describe el caso lo mas detalladamente posible"
          />
          <v-btn
            color="primary"
            block
            class="rounded-xl my-2"
            @click="evaluateStep(1)"
          >
            Continuar
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="stepper > 2"
          step="2"
          editable
        >
          NAP y ONU
        </v-stepper-step>

        <v-stepper-content step="2">
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
          <v-btn
            color="primary"
            block
            class="rounded-xl mt-4"
            @click="evaluateStep(2)"
          >
            Continuar
          </v-btn><br>
          <small v-if="ticket.client.naps.length < 1">
            <strong>Nota:</strong> Debes agregar al menos un NAP para continuar
          </small>
        </v-stepper-content>

        <v-stepper-step
          :complete="stepper > 3"
          step="3"
        >
          Acciones
        </v-stepper-step>

        <v-stepper-content step="3">
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
            @click="evaluateStep(3)"
          >
            {{ closeticket ? technicianescalated ? 'Cerrar Ticket' : 'Cerrar Ticket' : technicianescalated ? 'Escalar caso' : 'Crear Avance' }}
          </v-btn>
        </v-stepper-content>
      </v-stepper>
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
    technicianescalated: false,
    officeescalated: false,
    closeticket: false,
    loading: false
  }),
  computed: {
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  methods: {
    initComponent () {
      this.dialog = true
      this.stepper = 1
    },
    evaluateStep (step) {
      switch (step) {
        case 1:
          if (this.details.length > 0) {
            this.stepper++
          } else {
            this.$toast.error('Debes escribir un resumen del caso', { duration: 3000 })
          }
          break
        case 2:
          this.stepper++
          break
        case 3:
          this.createAdvance({
            ticket: this.ticket.id,
            details: this.details,
            technicianescalated: this.technicianescalated,
            officeescalated: this.officeescalated,
            closeticket: this.closeticket
          })
          break
      }
    },
    async createAdvance () {
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
              this.$simpleTelegramCreateTicketAdvance({
                ticket: this.ticket,
                client: this.ticket.client,
                status: this.closeticket,
                details: this.details,
                operator: this.$store.state.auth.username,
                telegramBots: this.telegramBots
              })
              this.$store.dispatch('ticket/getTicketsFromDatabase', {
                city: this.$route.query.city,
                clienttype: this.$route.query.clienttype,
                token: this.$store.state.auth.token,
                active: false,
                retired: false
              })
              this.$toast.success('Ticket Actualizado con Exito', { duration: 4000, position: 'bottom-center' })
              this.loading = false
            }
          }).catch((error) => {
            this.$toast.error(error, { position: 'bottom-center' })
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
