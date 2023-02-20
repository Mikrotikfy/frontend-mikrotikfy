<template>
  <v-card>
    <v-card-title class="justify-center">
      Listado de usuarios cortados por mes
    </v-card-title>
    <v-card-text class="d-flex">
      <MiscPrintDx :clients="clients" />
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="red darken-4"
            class="rounded-xl"
            v-bind="attrs"
            :loading="loading"
            :disabled="loading"
            v-on="on"
            @click="retire(selected)"
          >
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
        </template>
        <span>Retirar Usuarios</span>
      </v-tooltip>
    </v-card-text>
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
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Realizar Busqueda"
              style="max-width:500px;"
              outlined
              dense
              hide-details
            />
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="clients"
              :loading="loading"
              :search="search"
              show-select
            >
              <template v-slot:[`item.id`]="{ item }">
                <v-btn
                  small
                  color="red darken-4"
                  @click="retire([item])"
                >
                  <v-icon>mdi-cancel</v-icon>
                </v-btn>
              </template>
            </v-data-table>
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
      lastbillingperiod: {},
      clients: [],
      search: '',
      selected: [],
      headers: [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Direccion', value: 'addresses[0].address', sortable: false },
        { text: 'Barrio', value: 'addresses[0].neighborhood.name', sortable: false },
        { text: 'Telefono', value: 'phone', sortable: false },
        { text: 'Acciones', value: 'id', sortable: false }
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
  computed: {
    city () {
      return this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
    }
  },
  watch: {},
  mounted () {
    this.getBillingPeriods()
  },
  methods: {
    async getClients (billingperiod) {
      this.lastbillingperiod = billingperiod
      this.loading = true
      await this.$store.dispatch('cuts/getClientsByBillingPeriod', {
        token: this.$store.state.auth.token,
        clienttype: this.$route.query.clienttype,
        city: this.$route.query.city,
        month: billingperiod.month,
        year: billingperiod.year,
        indebt: true,
        active: true
      }).then((clients) => {
        clients.forEach((client) => {
          client.addresses.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
          })
        })
        this.clients = clients
        this.loading = false
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
    },
    async retire (clients) {
      if (clients.length < 1) {
        this.$toast.error('Selecciona los clientes antes de retirar', { position: 'bottom-center' })
        return
      }
      this.$toast.info('Aplicando cortes. Por favor espere...', { duration: 5000, position: 'bottom-center' })
      this.loading = true
      for (let i = 0; i < clients.length; i++) {
        await this.$store.dispatch('cuts/retireClient', {
          token: this.$store.state.auth.token,
          client: clients[i],
          active: false,
          indebt: false
        })
        await this.$store.dispatch('offer/setNewDebt', {
          token: this.$store.state.auth.token,
          city: this.city,
          isindebt: false,
          isretired: true,
          isBulkDx: false,
          client: clients[i],
          comment: 'RETIRO DESDE INTERFAZ CORTES',
          technician: this.$store.state.auth
        })
      }
      this.getClients(this.lastbillingperiod)
      this.loading = false
      this.$toast.info('Proceso finalizado correctamente', { duration: 5000, position: 'bottom-center' })
    }
  }
}
</script>
