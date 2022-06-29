<template>
  <div
    style="background-color:rgba(16,16,16,0.3);backdrop-filter:blur(5px);width:100%;"
    class="mb-5 rounded-xl"
    @click="infoModal = true"
  >
    <div class="parent-ticket text-center justify-center align-center py-2" :style="timelineItem.timeline ? 'border-bottom: 1px solid #adadad' : ''">
      <v-chip small :color="`${getColorStatus(timelineItem.active, timelineItem.answered, timelineItem.escalated, timelineItem.escalatedoffice)}`" class="white--text text-center justify-center ml-lg-2">
        {{ getState(timelineItem.active, timelineItem.answered, timelineItem.escalated, timelineItem.escalatedoffice) }}
      </v-chip>
      <span class="d-none d-xs-none d-md-block d-lg-block">{{ timelineItem.client.code }}</span>
      <span class="d-none d-xs-none d-md-block d-lg-block">{{ timelineItem.client.name }}</span>
      <span>{{ timelineItem.client.address }}</span>
      <span class="font-weight-bold" style="cursor:pointer;" @click="sortByNeighborhood">{{ timelineItem.client.neighborhood.name }}</span>
      <span class="d-none d-xs-none d-md-block d-lg-block">{{ timelineItem.client.phone }}</span>
      <span class="d-none d-xs-none d-md-block d-lg-block">{{ timelineItem.client.technology.name }}</span>
      <span class="d-none d-xs-none d-md-block d-lg-block">{{ timelineItem.tickettype.name }}</span>
      <span class="d-none d-xs-none d-md-block d-lg-block">Creado {{ $moment(timelineItem.createdAt).fromNow() }}</span>
      <span class="px-2 d-none d-xs-none d-sm-none d-md-block d-lg-block">
        <v-btn-toggle
          v-model="toggle"
          class="rounded-xl transparent"
        >
          <TicketTimeline
            :name="timelineItem.client.name"
            :clientid="timelineItem.client.id"
            :ticketid="timelineItem.id"
            :code="timelineItem.client.code"
          />

          <MiscTicketHistory
            :clientid="timelineItem.client.id"
            :name="timelineItem.client.name"
          />

          <MainClientStatus
            v-if="$route.query.clienttype === 'INTERNET'"
            :name="timelineItem.client.name"
            :clientid="timelineItem.client.id"
            :code="timelineItem.client.code"
          />

          <CreateTicketAdvance
            :editindex="editindex"
            :ticketid="timelineItem.id"
            :ticket="timelineItem"
            :client="timelineItem.client"
            :name="timelineItem.client.name"
            @updateTicketStatus="updateTicketStatus($event)"
          />

          <MiscTicketAdvanceHistory
            :ticketid="timelineItem.id"
            :name="timelineItem.client.name"
          />
        </v-btn-toggle>
      </span>
    </div>
    <div v-if="timelineItem.timeline" class="parent align-center pa-3">
      <span class="text-bold text-center">
        {{ ucfirst(timelineItem.timeline.technician.username) }}
      </span>
      <span class="text-bold text-center d-none d-xs-none d-sm-none d-md-block d-lg-block">
        {{ timelineItem.ticketdetails.length > 0 ? timelineItem.ticketdetails[0].operator.username + ': ' + timelineItem.ticketdetails[0].details : timelineItem.details }}
      </span>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span
            class="text-bold text-center text-subtitle-2 text-decoration-underline d-none d-xs-none d-sm-none d-md-block d-lg-block"
            v-bind="attrs"
            v-on="on"
          >
            {{ timelineItem.timeline.e6 === 1 ? timelineItem.timeline.ticketdiagnostic.diagnostictype.name : timelineItem.timeline.ticketsolution.solutiontype.name }}
            {{ timelineItem.timeline.ticketdiagnostic.details ? '*' : '' }}
          </span>
        </template>
        <span>{{ timelineItem.timeline.e6 === 1 ? timelineItem.timeline.ticketdiagnostic.diagnosticdetails : timelineItem.timeline.ticketsolution.solutiondetails }}</span>
      </v-tooltip>
      <span class="d-flex justify-center">
        <span :style="`color:${getChipColor(timelineItem.timeline.e6 === 1 ? 'ticketdiagnostic' : timelineItem.timeline.e6 === 2 ? 'ticketsolution' : 'complete')}`">
          {{ timelineItem.timeline.e6 === 1 ? 'DIAGNOSTICANDO' : timelineItem.timeline.e6 === 2 ? 'SOLUCIONANDO' : 'COMPLETADO' }}
        </span>
      </span>
      <span class="text-bold text-center">
        {{ timelineItem.timeline.e6 === 1 ? $moment(timelineItem.timeline.start).fromNow() : timelineItem.timeline.e6 === 2 ? $moment(timelineItem.timeline.start).fromNow() : $moment(timelineItem.timeline.end).fromNow() }}
      </span>
    </div>
    <TicketDetails
      :modal="infoModal"
      :ticket="timelineItem"
      @close="closeModal()"
    />
  </div>
</template>
<script>
export default {
  props: {
    timelineItem: {
      type: Object,
      required: true
    },
    editindex: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      complete: 0,
      color: 'green',
      toggle: null,
      infoModal: false
    }
  },
  methods: {
    sortByNeighborhood () {
      this.$emit('sortByNeighborhood')
    },
    getColor () {
      switch (this.timelineItem.timeline.e6) {
        case 1:
          this.complete = 10
          return 'red'
        case 2:
          this.complete = 50
          return 'orange'
        case 3:
          this.complete = 100
          return 'green'
      }
    },
    getChipColor (diagnostictype) {
      if (diagnostictype === 'ticketdiagnostic') {
        return 'red'
      } else if (diagnostictype === 'ticketsolution') {
        return 'orange'
      } else {
        return 'green'
      }
    },
    getColorStatus (state, answered, escalated, escalatedoffice) {
      if (state && !answered) {
        return 'blue darken-4'
      } else if (answered && state && !escalated && !escalatedoffice) {
        return 'orange darken-4'
      } else if (answered && state && escalated) {
        return 'purple darken-4'
      } else if (answered && state && !escalated && escalatedoffice) {
        return 'green darken-4'
      } else {
        return 'red'
      }
    },
    getState (state, answered, escalated, escalatedoffice) {
      if (state && !answered) {
        return 'Abierto'
      } else if (answered && state && !escalated && !escalatedoffice) {
        return 'Avance'
      } else if (answered && state && escalated) {
        return 'Escalado a Tecnico'
      } else if (answered && state && !escalated && escalatedoffice) {
        return 'Escalado a Oficina'
      } else {
        return 'Cerrado'
      }
    },
    ucfirst (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getHoursFromDate (date) {
      const now = this.$moment(new Date())
      const end = this.$moment(date)
      const duration = this.$moment.duration(now.diff(end))
      const hours = duration.asHours()
      return Math.floor(hours)
    },
    updateTicketStatus ({ editindex, closeTicket }) {
      this.$store.commit('ticket/updateTicketStatus', { editindex, closeTicket })
    },
    closeModal () {
      this.infoModal = false
    }
  }
}
</script>
<style>
.parent-ticket {
  display: grid;
  grid-template-columns: 1fr 2fr 4fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}
@media only screen and (max-width: 960px) {
  .parent-ticket {
    display: grid;
    grid-template-columns: 2fr 4fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 0px;
    padding: 0px 5px;
  }
}
.parent {
  display: grid;
  grid-template-columns: 2fr 12fr 6fr 3fr 3fr 4fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}

@media only screen and (max-width: 960px) {
  .parent {
    display: grid;
    grid-template-columns: 2fr 4fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 0px;
  }
}
</style>
