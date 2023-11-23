<template>
  <v-card>
    <v-card-title class="justify-center">
      Listado de servicios suspendidos por mes
    </v-card-title>
    <v-card-text class="d-flex">
      <MiscPrintDx :services="selected" />
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
          @click="getServices(billingperiod)"
        >
          <v-expansion-panel-header v-if="billingperiods.length > 0" class="justify-center">
            {{ billingperiod.month ? months[billingperiod.month - 1].name : 'No Definido' }}
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
              :items="services"
              :loading="loading"
              :search="search"
              show-select
            >
              <template v-slot:[`item.address`]="{ item }">
                <span>
                  {{ item.address }}
                </span>
              </template>
              <template v-slot:[`item.neighborhood`]="{ item }">
                <span>
                  {{ item.neighborhood }}
                </span>
              </template>
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
      services: [],
      search: '',
      selected: [],
      headers: [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'normalized_client.name', sortable: false },
        { text: 'Direccion', value: 'address', sortable: false },
        { text: 'Barrio', value: 'neighborhood', sortable: false },
        { text: 'Telefono', value: 'normalized_client.phone', sortable: false },
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
    async getServices (billingperiod) {
      this.lastbillingperiod = billingperiod
      this.loading = true
      await this.$store.dispatch('cuts/getServicesByBillingPeriod', {
        token: this.$store.state.auth.token,
        clienttype: this.$route.query.clienttype,
        city: this.$route.query.city,
        month: billingperiod.month,
        year: billingperiod.year,
        indebt: true,
        active: true
      }).then((services) => {
        if (services && services.length > 0) {
          services.forEach((service) => {
            service.service_addresses.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt)
            })
          })
        }
        this.services = services
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
    async retire (services) {
      if (services.length < 1) {
        this.$toast.error('Selecciona los servicios antes de retirar', { position: 'bottom-center' })
        return
      }
      this.$toast.info('Aplicando cortes. Por favor espere...', { duration: 5000, position: 'bottom-center' })
      this.loading = true
      for (let i = 0; i < services.length; i++) {
        await this.$store.dispatch('cuts/retireService', {
          token: this.$store.state.auth.token,
          service: services[i],
          active: false,
          indebt: false
        })
        await this.$store.dispatch('offer/setNewDebt', {
          token: this.$store.state.auth.token,
          city: this.city,
          isindebt: false,
          isretired: true,
          isBulkDx: false,
          service: services[i],
          comment: 'RETIRO DESDE INTERFAZ SUSPENCIONES',
          technician: this.$store.state.auth
        })
      }
      this.getServices(this.lastbillingperiod)
      this.loading = false
      this.$toast.info('Proceso finalizado correctamente', { duration: 5000, position: 'bottom-center' })
    }
  }
}
</script>
