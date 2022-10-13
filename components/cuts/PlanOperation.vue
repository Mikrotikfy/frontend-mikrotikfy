<template>
  <div>
    <v-card>
      <v-card-text class="text-center">
        Aplicar <strong>{{ offerForBulkProcess ? offerForBulkProcess.name : '' }}</strong> a <strong>{{ clientsByPlan.length }}</strong> clientes
      </v-card-text>
      <v-card-text class="d-flex">
        <v-btn
          color="red darken-4 mx-auto justify-self-center"
          class="mb-5"
          x-large
          :loading="loading"
          @click="process"
        >
          Iniciar proceso de cortes
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    clientsByPlan () {
      return this.$store.state.cuts.clientsByPlan
    },
    offerForBulkProcess () {
      return this.$store.state.cuts.offerForBulkProcess
    },
    city () {
      return this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
    }
  },
  methods: {
    async process () {
      for (let i = 0; i < this.clientsByPlan.length; i++) {
        const client = this.clientsByPlan[i]

        const offer = this.offerForBulkProcess

        await this.$store.dispatch('offer/setNewOffer', {
          token: this.$store.state.auth.token,
          client,
          offer,
          details: 'NORMALIZACION DE TARIFAS EN LOTE',
          technician: this.$store.state.auth
        })
        await this.$store.dispatch('client/setAuxPlan', {
          token: this.$store.state.auth.token,
          clientId: client.id,
          plan: offer.plan,
          index: null
        })
        await this.$store.dispatch('client/setPlanFromModal', {
          clientId: client.id,
          clientIndex: null,
          isOfferChange: false,
          kick: false,
          isBulkDx: true,
          newPlan: { id: offer.plan.id },
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
      }
    }
  }
}
</script>
