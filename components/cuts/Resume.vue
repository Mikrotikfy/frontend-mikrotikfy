<template>
  <v-card>
    <v-card-title class="justify-center">
      Cortes por mes
    </v-card-title>
    <v-card-text>
      <v-expansion-panels
        v-model="panel"
        variant="accordion"
      >
        <v-expansion-panel
          v-for="billingperiod in billingperiods"
          :key="billingperiod.id"
          @click="getClients(billingperiod)"
        >
          <v-expansion-panel-header class="justify-center">
            {{ months[billingperiod.month - 1].name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :headers="headers"
              :items="clients"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      panel: [0, 1],
      prepare: false,
      loading: false,
      billingperiods: [],
      clients: [],
      headers: [
        { text: 'Codigo', value: 'code' },
        { text: 'Nombre', value: 'name' },
        { text: 'Direccion', value: 'addresses[0].address' },
        { text: 'Barrio', value: 'addresses[0].neighborhood.name' },
        { text: 'Telefono', value: 'phone' }
      ],
      months: [
        { id: 1, name: 'Enero' },
        { id: 2, name: 'Febrero' },
        { id: 3, name: 'Marzo' },
        { id: 4, name: 'Abril' },
        { id: 5, name: 'Mayo' },
        { id: 6, name: 'Junio' },
        { id: 7, name: 'Julio' },
        { id: 8, name: 'Agosto' },
        { id: 9, name: 'Septiembre' },
        { id: 10, name: 'Octubre' },
        { id: 11, name: 'Noviembre' },
        { id: 12, name: 'Diciembre' }
      ]
    }
  },
  watch: {},
  mounted () {
    this.loading = true
    this.getBillingPeriods()
  },
  methods: {
    async getClients (billingperiod) {
      await this.$store.dispatch('cuts/getClientsByBillingPeriod', {
        token: this.$store.state.auth.token,
        clienttype: this.$route.query.clienttype,
        city: this.$route.query.city,
        month: billingperiod.month,
        year: billingperiod.year
      }).then((clients) => {
        clients.forEach((client) => {
          client.addresses.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
          })
        })
        this.clients = clients
      })
    },
    async getBillingPeriods () {
      await this.$store.dispatch('cuts/getBillingPeriods', {
        token: this.$store.state.auth.token,
        clienttype: this.$route.query.clienttype,
        city: this.$route.query.city
      }).then((billingperiods) => {
        this.billingperiods = billingperiods
      })
    }
  }
}
</script>
