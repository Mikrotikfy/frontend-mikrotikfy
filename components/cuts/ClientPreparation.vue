<template>
  <div>
    <v-card>
      <v-card-text v-if="!prepare" class="justify-center d-flex">
        <v-btn
          color="error"
          large
          @click="prepareServices"
        >
          <v-icon>mdi-account</v-icon>
          <span>Realizar Cortes</span>
        </v-btn>
      </v-card-text>
      <v-card-text v-else>
        <v-data-table
          :headers="headers"
          :items="services"
          :loading="loading"
          :item-class="getcolor"
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
        </v-data-table>
      </v-card-text>
      <v-card-text>
        <v-btn
          @click="$store.commit('cuts/e1', '1')"
        >
          Cancelar
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      headers: [
        { text: 'Codigo', value: 'code' },
        { text: 'Nombre', value: 'normalized_client.name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Barrio', value: 'neighborhood' },
        { text: 'Telefono', value: 'normalized_client.phone' },
        { text: 'Plan', value: 'plan.name' }
      ]
    }
  },
  computed: {
    prepare () {
      return this.$store.state.cuts.prepare
    },
    ready () {
      return this.$store.state.cuts.ready
    },
    validServices () {
      return this.$store.state.cuts.validServices
    },
    services () {
      return this.$store.state.cuts.services
    },
    loading () {
      return this.$store.state.cuts.loading
    },
    currentBillingPeriod () {
      return this.$store.state.cuts.currentBillingPeriod
    },
    billingmonth () {
      return this.$store.state.cuts.month
    },
    billingyear () {
      return this.$store.state.cuts.year
    }
  },
  methods: {
    prepareServices () {
      if (!this.ready) {
        this.$toast.error('No hay servicios para preparar')
        return
      }
      this.$store.commit('cuts/prepare', true)
      this.$store.commit('cuts/reset')

      this.beginServerSideProcess()
    },
    beginServerSideProcess () {
      this.$store.dispatch('cuts/beginServerSideProcess', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        kick: this.$store.state.cuts.kick,
        services: this.ready,
        currentBillingPeriod: this.currentBillingPeriod,
        billingmonth: this.billingmonth,
        billingyear: this.billingyear
      })
    },
    getcolor (item) {
      if (item.valid) {
        return 'success--text'
      } else {
        return 'error--text'
      }
    }
  }
}
</script>
