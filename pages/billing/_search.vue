<template>
  <v-container v-if="currentService" fluid>
    <BillingClientSearch />
    <v-row class="mt-0">
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        lg="5"
        xl="5"
        class="parent-container"
      >
        <BillingLegalNotesList />
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        lg="7"
        xl="7"
        class="parent"
      >
        <v-card class="rounded-lg">
          <v-card-title class="text-caption">
            <nuxt-link
              :to="`/client/${currentService.normalized_client.id}?service=${currentService.id}&city=${$route.query.city}&clienttype=${$route.query.clienttype}`"
              class="hideMe rounded-xl text-body-1 white--text text-weight-bold"
            >
              {{ currentService.code }} / {{ currentService.normalized_client.name }} / {{ processAddresses(currentService) }} / {{ processAddressesNeighborhood(currentService) }}
            </nuxt-link>
          </v-card-title>
          <v-card-text>
            <div>
              <v-btn
                rounded
                text
                class="grey darken-2 mr-2"
              >
                <v-icon class="mr-1">
                  mdi-map-marker-circle
                </v-icon>
                {{ currentService.city.name }}
              </v-btn>
              <MainClientControl :service="currentService" :index="-1" class="mr-2" />
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    :color="$vuetify.theme.dark ? 'white black--text' : 'primary'"
                    :to="`/billing/resume?city=${$route.query.city}&clienttype=${$route.query.clienttype}`"
                    v-on="on"
                  >
                    <v-icon>mdi-text-box-check-outline</v-icon>
                  </v-btn>
                </template>
                <span>Movimientos Generales</span>
              </v-tooltip>
              <CreateTicket :service="currentService" :filled="true" />
              <BillingPrintMovement :service="currentService" />
              <BillingClientAddAmount :service="currentService" />
              <BillingToggleArchive class="ml-2" />
            </div>
          </v-card-text>
          <v-card-text style="height: calc(100vh - 376px);overflow-y:scroll;">
            <BillingClientDetail />
          </v-card-text>
          <v-card-actions style="position: absolute;bottom: 0;border-top:grey solid 1px;width:100%;" class="d-flex pl-6 grey darken-4">
            <BillingClientTotal :service="currentService" />
          </v-card-actions>
        </v-card>
        <BillingClientDiscountAmount :service="currentService" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'BillingSearch',
  computed: {
    selected () {
      return this.$store.state.billing.selected
    },
    currentService () {
      return this.$store.state.billing.currentService || null
    },
    showPayed () {
      return this.$store.state.billing.showPayed
    }
  },
  watch: {
    '$store.state.billing.refresh' () {
      this.getBillingInfoByServiceId()
    },
    '$store.state.billing.showPayed' () {
      this.getBillingInfoByServiceId()
    },
    '$route' () {
      this.$store.commit('billing/resetInvoices')
      this.$router.push({
        path: `/billing?city=${this.$route.query.city}`
      })
    }
  },
  mounted () {
    this.getBillingInfoByServiceId()
    this.$store.commit('billing/getCurrentMonth')
  },
  methods: {
    async getBillingInfoByServiceId () {
      if (this.$route.params.search) {
        await this.$store.dispatch('billing/getBillingInfoByServiceId', {
          serviceId: this.$route.params.search,
          showPayed: this.showPayed,
          token: this.$store.state.auth.token
        })
      }
    },
    processAddresses (service) {
      if (!service) { return 'Sin Direccion' }
      const address = service?.address
      const serviceAddresses = service?.service_addresses
      if (address && !serviceAddresses) { return address }
      if (address && serviceAddresses.length === 0) { return address }
      if (!address && serviceAddresses.length < 1) { return 'Sin Dirección' }
      if (address && serviceAddresses.length > 0) { return serviceAddresses.at(-1).address }
      if (!address && serviceAddresses.length > 0) { return serviceAddresses.at(-1).address }
    },
    processAddressesNeighborhood (service) {
      if (!service) { return 'Sin Barrio' }
      const addresses = service.service_addresses
      const neighborhood = service.neighborhood
      if (neighborhood && !addresses) { return neighborhood.name }
      if (neighborhood && addresses.length === 0) { return neighborhood.name }
      if (!neighborhood && addresses.length < 1) { return 'Sin Barrio' }
      if (neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
      if (!neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (!neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
    }
  }
}
</script>
<style scoped>
.parent {
  display: grid;
  grid-auto-rows: 8fr 1fr 1fr 1fr;
  grid-gap: 10px;
  height: calc(100vh - 81px);
}
.parent-list {
  display: grid;
  grid-auto-rows: minmax(1fr, auto);
  grid-gap: 10px;
}
.parent-container {
  max-height: calc(100vh - 168px);
  overflow-y: scroll;
}
</style>
