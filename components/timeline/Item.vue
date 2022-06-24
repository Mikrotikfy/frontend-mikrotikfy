<template>
  <div>
    <div class="parent-ticket text-center justify-center align-center py-2" style="border-bottom: 1px solid #adadad">
      <span>{{ timelineItem.client.code }}</span>
      <span>{{ timelineItem.client.dni }}</span>
      <span>{{ timelineItem.client.name }}</span>
      <span>{{ timelineItem.client.address }}</span>
      <span>{{ timelineItem.client.neighborhood.name }}</span>
      <span>{{ timelineItem.client.phone }}</span>
      <span>{{ timelineItem.client.technology.name }}</span>
      <span>{{ timelineItem.ticket.tickettype.name }}</span>
      <span>{{ timelineItem.ticket.assignated.username }}</span>
      <span>{{ timelineItem.ticket.ticketdetails.length > 0 ? timelineItem.ticket.ticketdetails.operator.username + ': ' + timelineItem.ticket.ticketdetails[0].details : timelineItem.ticket.details }}</span>
      <span>{{ $moment(timelineItem.ticket.createdAt).fromNow() }}</span>
      <span>Acciones</span>
    </div>
    <div class="parent mt-2 align-center">
      <span class="text-bold text-center text-h6">
        {{ ucfirst(timelineItem.technician.username) }}
      </span>
      <span>
        <v-progress-linear
          :value="complete"
          :buffer-value="complete"
          :color="getColor(timelineItem.e6 === 1 ? timelineItem.ticketdiagnostic.diagnostictype.name : timelineItem.ticketsolution.solutiontype.name)"
          class="rounded-xl"
          stream
          height="10"
        />
      </span>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span
            class="text-bold text-center text-subtitle-2 text-decoration-underline"
            v-bind="attrs"
            v-on="on"
          >
            {{ timelineItem.e6 === 1 ? timelineItem.ticketdiagnostic.diagnostictype.name : timelineItem.ticketsolution.solutiontype.name }}
            {{ timelineItem.ticketdiagnostic.details ? '*' : '' }}
          </span>
        </template>
        <span>{{ timelineItem.e6 === 1 ? timelineItem.ticketdiagnostic.diagnosticdetails : timelineItem.ticketsolution.solutiondetails }}</span>
      </v-tooltip>
      <span class="d-flex justify-center">
        <span :style="`color:${getChipColor(timelineItem.e6 === 1 ? 'ticketdiagnostic' : timelineItem.e6 === 2 ? 'ticketsolution' : 'complete')}`">
          {{ timelineItem.e6 === 1 ? 'DIAGNOSTICANDO' : timelineItem.e6 === 2 ? 'SOLUCIONANDO' : 'COMPLETADO' }}
        </span>
      </span>
      <span class="text-bold text-center text-h6">
        {{ timelineItem.e6 === 1 ? 'Iniciado ' : timelineItem.e6 === 2 ? 'Iniciado ' : 'Solucionado ' }}
        {{ timelineItem.e6 === 1 ? $moment(timelineItem.start).fromNow() : timelineItem.e6 === 2 ? $moment(timelineItem.start).fromNow() : $moment(timelineItem.end).fromNow() }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    timelineItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      complete: 0,
      color: 'green'
    }
  },
  methods: {
    getColor () {
      switch (this.timelineItem.e6) {
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
    ucfirst (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getHoursFromDate (date) {
      const now = this.$moment(new Date())
      const end = this.$moment(date)
      const duration = this.$moment.duration(now.diff(end))
      const hours = duration.asHours()
      return Math.floor(hours)
    }
  }
}
</script>
<style>
.parent-ticket {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr 2fr 1fr 1fr 1fr 1fr 1fr 4fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}
.parent {
  display: grid;
  grid-template-columns: 2fr 12fr 3fr 3fr 4fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}
</style>
