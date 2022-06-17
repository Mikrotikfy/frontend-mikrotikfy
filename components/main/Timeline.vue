<template>
  <v-container fluid>
    <v-card class="rounded-xl elevation-0" style="background-color:rgba(16,16,16,0.3);backdrop-filter:blur(5px);">
      <v-card-text>
        <v-row class="align-center">
          <h1 style="border-right: 1px solid #aeaeae;" class="text-bold pa-3 text-center align-center vertical">
            Timeline
          </h1>
          <v-container class="mx-0 px-0 align-center" style="width:95%;">
            <TimelineItem
              v-for="item in timeline"
              :key="item.id"
              :timeline-item="item"
            />
          </v-container>
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
      //
    }
  },
  computed: {
    timeline () {
      return this.$store.state.timeline.timeline
    }
  },
  mounted () {
    this.getTimeline()
    setInterval(this.getTimeline(), 60000)
  },
  methods: {
    getTimeline () {
      this.$store.dispatch('timeline/getTimeline', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
<style>
.vertical{
    writing-mode: vertical-lr;
}
</style>
