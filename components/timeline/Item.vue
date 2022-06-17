<template>
  <div v-if="getHoursFromDate(timelineItem.end) < 12" class="parent mt-2 align-center">
    <span class="text-bold text-center text-h6">
      {{ ucfirst(timelineItem.technician.name) }}
    </span>
    <span>
      <v-progress-linear
        :value="complete"
        :buffer-value="complete"
        :color="getColor(timelineItem.ticketdiagnostic.active ? timelineItem.ticketdiagnostic.diagnostictype.name : timelineItem.ticketsolution.solutiontype.name)"
        class="rounded-xl"
        stream
        height="25"
      />
    </span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <span
          class="text-bold text-center text-subtitle-2 text-decoration-underline"
          v-bind="attrs"
          v-on="on"
        >
          {{ timelineItem.ticketdiagnostic.active ? timelineItem.ticketdiagnostic.diagnostictype.name : timelineItem.ticketsolution.solutiontype.name }}
          {{ timelineItem.ticketdiagnostic.details ? '*' : '' }}
        </span>
      </template>
      <span>{{ timelineItem.ticketdiagnostic.active ? timelineItem.ticketdiagnostic.diagnosticdetails :  timelineItem.ticketsolution.solutiondetails }}</span>
    </v-tooltip>
    <span class="d-flex justify-center">
      <span :style="`color:${getChipColor(timelineItem.ticketdiagnostic.active ? 'ticketdiagnostic' : timelineItem.ticketsolution.active ? 'ticketsolution' : 'complete')}`">
        {{ timelineItem.ticketdiagnostic.active ? 'DIAGNOSTICANDO' : timelineItem.ticketsolution.active ? 'SOLUCIONANDO' : 'COMPLETADO' }}
      </span>
    </span>
    <span class="text-bold text-center text-h6">
      {{ timelineItem.ticketdiagnostic.active ? 'Iniciado ' : timelineItem.ticketsolution.active ? 'Iniciado ' : 'Solucionado ' }}{{ $moment(timelineItem.end).fromNow() }}
    </span>
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
      const stage = this.timelineItem.ticketdiagnostic.active
        ? 1
        : this.timelineItem.ticketsolution.active
          ? 2
          : 3
      switch (stage) {
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
.parent {
  display: grid;
  grid-template-columns: 2fr 12fr 3fr 3fr 4fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}
</style>
