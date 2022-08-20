<template>
  <v-card>
    <v-card-title class="justify-center">
      Pendientes por pagar ({{ $store.state.cuts.billingPeriodMovements.length }})
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="billingPeriodMovements"
        :loading="loading"
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      prepare: false,
      loading: false,
      headers: [
        { text: 'Codigo', value: 'client.code' },
        { text: 'Nombre', value: 'client.name' },
        { text: 'Direccion', value: 'client.address' },
        { text: 'Barrio', value: 'client.neighborhood.name' },
        { text: 'Telefono', value: 'client.phone' }
      ]
    }
  },
  computed: {
    billingPeriodMovements () {
      return this.$store.state.cuts.billingPeriodMovements
    }
  },
  watch: {},
  mounted () {
    this.loading = true
    this.getBillingPeriodMovements()
  },
  methods: {
    async getBillingPeriodMovements () {
      await this.$store.dispatch('cuts/getBillingPeriod', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city
      }).then(async (billingperiod) => {
        if (billingperiod.name === 'default') {
          this.$toast.error('No hay datos para continuar', { duration: 4000, position: 'top-center' })
          this.loading = false
          return
        }
        await this.$store.dispatch('cuts/getBillingPeriodMovements', {
          city: this.$route.query.city,
          token: this.$store.state.auth.token,
          billingPeriod: billingperiod.data[0]
        })
        this.loading = false
      })
    }
  }
}
</script>
