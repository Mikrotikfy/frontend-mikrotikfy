<template>
  <div class="parent mt-2">
    <span class="text-bold text-center text-h6">
      {{ ucfirst(timelineItem.technician.name) }}
    </span>
    <span>
      <v-progress-linear
        :value="complete"
        :buffer-value="complete"
        :color="getColor(timelineItem.diagnostic.active ? timelineItem.diagnostic.type : timelineItem.solution.type)"
        class="rounded-xl"
        stream
        height="25"
      />
    </span>
    <span class="text-bold text-center text-subtitle">
      {{ timelineItem.diagnostic.active ? timelineItem.diagnostic.type : timelineItem.solution.type }}
    </span>
    <span class="d-flex justify-center">
      <v-chip :color="getChipColor(timelineItem.diagnostic.active ? 'diagnostic' : timelineItem.solution.active ? 'solution' : 'complete')">
        {{ timelineItem.diagnostic.active ? 'DIAGNOSTICANDO' : timelineItem.solution.active ? 'SOLUCIONANDO' : 'COMPLETADO' }}
      </v-chip>
    </span>
    <span class="text-bold text-center text-h6">
      {{ $moment(timelineItem.start).fromNow() }}
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
      const stage = this.timelineItem.diagnostic.active
        ? 1
        : this.timelineItem.solution.active
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
    getChipColor (type) {
      console.log(type)
      if (type === 'diagnostic') {
        return 'red'
      } else if (type === 'solution') {
        return 'orange'
      } else {
        return 'green'
      }
    },
    ucfirst (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>
<style>
.parent {
  display: grid;
  grid-template-columns: 2fr 12fr 3fr 3fr 3fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}
</style>
