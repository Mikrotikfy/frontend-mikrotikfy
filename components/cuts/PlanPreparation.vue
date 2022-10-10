<template>
  <v-card>
    <v-card-title>
      Aplicar Tarifa a <strong v-if="$store.state.cuts.clientsByPlan.length > 0" class="ml-1 mr-1"> {{ this.$store.state.cuts.clientsByPlan.length }} </strong> clientes
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-select
          v-model="offer"
          :items="offers"
          label="Tarifas Disponibles"
          item-text="name"
          item-value="id"
          return-object
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      offer: null,
      offers: [],
      loading: false
    }
  },
  computed: {
    clients () {
      return this.$store.state.cuts.clientsByPlan
    }
  },
  watch: {
    offer () {
      this.$store.commit('cuts/setOfferForBulkProcess', this.offer)
    }
  },
  async mounted () {
    this.offers = await this.$store.dispatch('offer/getOffers', {
      token: this.$store.state.auth.token
    })
  }
}
</script>
