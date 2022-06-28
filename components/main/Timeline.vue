<template>
  <v-container fluid>
    <v-card class="elevation-0 transparent">
      <v-card-text class="transparent px-0 mx-0">
        <v-row class="mx-0 px-0 align-center">
          <TimelineItem
            v-for="item in timeline"
            :key="item.id"
            :editindex="timeline.indexOf(item)"
            :timeline-item="{...item, index}"
          />
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'Timeline',
  data () {
    return {
      infoModal: false
    }
  },
  computed: {
    timeline () {
      return this.$store.state.timeline.timeline
    }
  },
  mounted () {
    this.getTimeline()
  },
  methods: {
    getTimeline () {
      this.$store.dispatch('timeline/getTickets', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token,
        clienttype: this.$route.query.clienttype,
        active: false,
        retired: false
      })
    },
    closeModal () {
      this.infoModal = false
    }
  }
}
</script>
<style>
.vertical{
    writing-mode: vertical-lr;
}
</style>
