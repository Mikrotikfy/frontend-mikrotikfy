<template>
  <v-card class="elevation-0">
    <v-card-title class="justify-center">
      Historial de tarifas
    </v-card-title>
    <v-card-text style="display:grid;place-items:center;">
      <v-chip
        v-for="(offer, index) in offerHistory"
        :key="index"
        rounded
        class="mb-2"
      >
        {{ offer.offer.name }} - {{ getDate(offer.createdAt) }} - {{ offer.technician ? offer.technician.username : '' }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'MiscOfferHistory',
  data () {
    return {}
  },
  computed: {
    offerHistory () {
      return this.$store.state.offer.offerHistory
    }
  },
  methods: {
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
