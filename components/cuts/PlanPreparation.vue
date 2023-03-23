<template>
  <div>
    <v-card>
      <v-card-title>
        Aplicar Tarifa a <strong v-if="clientsByPlan.length > 0" class="ml-1 mr-1"> {{ clientsByPlan.length }} </strong> clientes
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
    <v-btn
      v-if="(clients.length > 0 || clientsByPlan.length > 0) && !loading"
      color="primary"
      class="mt-5"
      @click="process"
    >
      Continuar
    </v-btn>
  </div>
</template>
<script>
export default {
  data () {
    return {
      offer: null,
      loading: false
    }
  },
  computed: {
    clients () {
      return this.$store.state.cuts.clientsByPlan
    },
    clientsByPlan () {
      return this.$store.state.cuts.clientsByPlan
    },
    offers () {
      return this.$store.state.offer.offers
    }
  },
  watch: {
    offer () {
      this.$store.commit('cuts/setOfferForBulkProcess', this.offer)
    }
  },
  mounted () {
    this.getOffers()
  },
  methods: {
    async getOffers () {
      await this.$store.dispatch('offer/getOffers', {
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
