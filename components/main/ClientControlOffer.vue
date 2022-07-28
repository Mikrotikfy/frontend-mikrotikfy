<template>
  <v-btn-toggle
    v-model="selected"
    rounded
  >
    <v-btn
      v-for="(offer, index) in offers"
      :key="index"
      color="primary"
    >
      {{ offer.name }}
    </v-btn>
  </v-btn-toggle>
</template>
<script>
export default {
  name: 'ClientControl',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selected: null,
      offers: []
    }
  },
  mounted () {
    this.getOffers()
  },
  methods: {
    setNewOffer () {
      this.modal = true
    },
    async getOffers () {
      this.offers = await this.$store.dispatch('offer/getOffers', {
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
