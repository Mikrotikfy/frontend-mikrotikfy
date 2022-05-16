<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
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
    <v-dialog
      v-model="modal"
      max-width="590"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Crear Avance en Ticket
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <v-textarea
              v-model="ticketAdvance.details"
              outlined
              class="mt-4"
              label="Detalles adicionales"
            />
            <v-checkbox
              v-if="$isAdmin()"
              v-model="ticketAdvance.escalated"
              color="red"
              label="Escalar a tecnico?"
            />
            <v-checkbox
              v-if="$store.state.auth.rolename === 'superadmin'"
              v-model="ticketAdvance.escalatedoffice"
              color="red"
              label="Escalar a oficina?"
            />
            <v-checkbox
              v-if="$isAdmin()"
              v-model="ticketAdvance.escalatedoffice"
              color="red"
              label="Escalar a oficina?"
            />
            <v-checkbox
              v-model="ticketAdvance.closeTicket"
              color="red"
              label="Cerrar Ticket?"
            />
          </v-card-text>
        </div>
        <v-card-actions>
          <v-btn
            :loading="loading"
            :diabled="loading"
            :color="ticketAdvance.closeTicket ? 'red darken-4' : 'blue darken-4'"
            @click="CreateTicketAdvance()"
          >
            {{ ticketAdvance.closeTicket ? ticketAdvance.escalated ? 'Cerrar Ticket' : 'Cerrar Ticket' : ticketAdvance.escalated ? 'Escalar caso' : 'Crear Avance' }}
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
  name: 'CreateTicketAdvance',
  props: {
    editindex: {
      type: Number,
      default: -1
    },
    ticketid: {
      type: Number,
      default: -1
    },
    ticket: {
      type: Object,
      default: () => ({})
    },
    client: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    ticketAdvance: {
      id: '',
      details: '',
      closeTicket: false,
      escalated: false,
      escalatedoffice: false,
      editindex: -1
    }
  }),
  computed: {
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  methods: {
    initComponent () {
      this.modal = true
      this.ticketAdvance.id = this.ticketid
      this.ticketAdvance.editindex = this.editindex
    },
    async CreateTicketAdvance () {
      this.loading = true
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets/${this.ticketid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: { active: !this.ticketAdvance.closeTicket, escalated: this.ticketAdvance.escalated, escalatedoffice: this.ticketAdvance.escalatedoffice, answered: true }
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
                ticket: this.ticketid,
                ticketype: this.ticketAdvance.id,
                details: this.ticketAdvance.details,
                operator: this.$store.state.auth.id,
                telegramBots: this.telegramBots
              }
            })
          }).then((input) => {
            if (input.status === 200) {
              this.modal = false
              this.$emit('updateTicketStatus', this.ticketAdvance)
              this.$simpleTelegramCreateTicketAdvance({
                client: this.client,
                ticket: this.ticket,
                status: this.ticketAdvance.closeTicket,
                details: this.ticketAdvance.details,
                operator: this.$store.state.auth.username,
                telegramBots: this.telegramBots
              })
              this.$toast.success('Ticket Actualizado con Exito', { duration: 4000, position: 'top-center' })
              this.loading = false
            }
          }).catch((error) => {
            this.$toast.error(error, { position: 'top-center' })
          })
        }
      }).catch((error) => {
        this.$toast.error(error, { position: 'top-center' })
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
