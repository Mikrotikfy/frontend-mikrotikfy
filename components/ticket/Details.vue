<template>
  <v-dialog
    v-if="!$store.state.isDesktop"
    v-model="modal"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar class="transparent elevation-0" dense>
        <v-spacer />
        <v-btn
          icon
          @click="closeModal"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text style="display:grid;place-items:normal;height:90%;position:absolute;">
        <v-chip :color="getTicketTypeColor(ticket.tickettype ? ticket.tickettype.name : '')" small>
          {{ ticket.tickettype ? ticket.tickettype.name : '' }}
        </v-chip>
        <h4>{{ ticket.client ? ticket.client.code : '' }}</h4>
        <h4>{{ ticket.client ? ticket.client.name : '' }}</h4>
        <h4>{{ ticket.client ? ticket.client.address : '' }}</h4>
        <h4>{{ ticket.client ? ticket.client.neighborhood.name : '' }}</h4>
        <h4>{{ ticket.client ? ticket.client.phone : '' }}</h4>
        <h4>{{ ticket.client ? ticket.client.technology.name : '' }}</h4>
        <p class="mb-0">
          Detalles
        </p>
        <h4>{{ ticket ? ticket.details : '' }}</h4>
        <p class="mb-0">
          Creado
        </p>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <span
              class="text-bold"
              v-bind="attrs"
              v-on="on"
            >{{$moment(ticket.createdAt).fromNow() }}</span>
          </template>
          <span>{{ getDate(ticket.createdAt) }}</span>
        </v-tooltip>
        <div v-if="ticket.client !== undefined" class="mt-10">
          <TicketTimeline
            :block="true"
            :name="ticket.client.name"
            :clientid="ticket.client.id"
            :ticketid="ticket.id"
            :code="ticket.client.code"
            @endService="closeModal"
          />
          <MainClientStatus
            :block="true"
            :name="ticket.client.name"
            :clientid="ticket.client.id"
            :code="ticket.client.code"
          />
          <CreateTicketAdvance
            :block="true"
            :editindex="ticket.editindex"
            :ticketid="ticket.id"
            :ticket="ticket"
            :client="ticket.client"
            :name="ticket.client.name"
            @updateTicketStatus="updateTicketStatus($event)"
          />
          <MiscTicketAdvanceHistory
            :block="true"
            :ticketid="ticket.id"
            :name="ticket.client.name"
          />
          <TvServiceStepper
            v-if="$route.query.clienttype === 'TELEVISION'"
            :clientid="ticket.client.id"
            :block="true"
          />
          <MiscTicketHistory
            :clientid="ticket.client.id"
            :name="ticket.client.name"
            :block="true"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    ticket: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    getTicketTypeColor (tickettype) {
      if (tickettype === 'SIN SERVICIO') {
        return 'red'
      } else if (tickettype === 'SERVICIO LENTO') {
        return 'orange darken-2'
      } else if (tickettype === 'INTERMITENCIA') {
        return 'orange darken-4'
      } else {
        return 'primary'
      }
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
