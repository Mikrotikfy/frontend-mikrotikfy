<template>
  <div class="parent mt-2">
    <span class="text-bold text-center text-h6">
      {{ timelineItem.technician.name }}
    </span>
    <span>
      <v-progress-linear
        v-model="complete"
        :color="getColor()"
        height="25"
      />
    </span>
    <span class="text-bold text-center text-subtitle">
      {{ timelineItem.diagnostic.ended ? timelineItem.solution.type : timelineItem.diagnostic.type }}
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
    }
  }
}
</script>
<style>
.parent {
  display: grid;
  grid-template-columns: 2fr 12fr 3fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}
</style>
