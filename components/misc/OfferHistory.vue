<template>
  <v-card class="elevation-0">
    <v-card-title>
      Historial de tarifas
    </v-card-title>
    <v-card-text>
      <div>
        <p
          v-for="(offer, index) in offerHistory"
          :key="index"
        >
          {{ offer.offer.name }} - {{ getDate(offer.createdAt) }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'MiscOfferHistory',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    offerHistory () {
      return this.$store.state.offer.offerHistory
    }
  },
  mounted () {
    this.getOfferHistory()
  },
  methods: {
    getOfferHistory () {
      this.$store.dispatch('offer/getOfferHistory', {
        client: this.client,
        token: this.$store.state.auth.token
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
