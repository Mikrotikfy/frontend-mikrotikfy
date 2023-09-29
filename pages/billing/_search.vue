<template>
  <v-container fluid style="height:calc(100vh - 48px);">
    <BillingClientSearch />
    <v-row class="mt-0">
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        lg="5"
        xl="5"
        class="parent-container">
        <div class="parent-list">
          <v-card class="rounded-lg">
            <v-card-text>
              <BillingLegalNotesList />
            </v-card-text>
          </v-card>
        </div>
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
            <span v-if="currentClient" ref="clientP" class="hideMe rounded-xl text-body-1">
              <MainClientControl :client="currentClient" :index="-1" />
              <v-chip outlined tag class="text-caption">
                {{ currentClient.code }} / {{ currentClient.name }} / {{ processAddresses(currentClient) }} / {{ processAddressesNeighborhood(currentClient) }}
              </v-chip>
            </span>
            <v-spacer />
            <div class="d-flex align-center">
              <BillingToggleArchive />
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    class="rounded-xl black--text mr-2"
                    :color="$vuetify.theme.dark ? 'white black--text' : 'primary'"
                    :to="`/billing/resume?city=${$route.query.city}&clienttype=${$route.query.clienttype}`"
                    v-on="on"
                  >
                    <v-icon>mdi-text-box-check-outline</v-icon>
                  </v-btn>
                </template>
                <span>Movimientos Generales</span>
              </v-tooltip>
              <CreateTicket v-if="currentClient" :client="currentClient" :filled="true" />
              <BillingPrintMovement />
            </div>
          </v-card-title>
          <v-card-text style="height: calc(100vh - 549px);overflow-y:scroll;">
            <BillingClientDetail />
          </v-card-text>
          <v-card-actions style="position: absolute;bottom: 0;border-top:grey solid 1px;width:100%;" class="d-flex pl-6 grey darken-4">
            <BillingClientTotal />
          </v-card-actions>
        </v-card>
        <BillingClientDiscountAmount />
        <BillingClientAddAmount />
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
    currentClient () {
      return this.$store.state.billing.currentClient || null
    },
    showPayed () {
      return this.$store.state.billing.showPayed
    }
  },
  watch: {
    '$store.state.billing.refresh' () {
      this.getBillingInfoByClientId()
    },
    '$store.state.billing.showPayed' () {
      this.getBillingInfoByClientId()
    },
    '$route' () {
      this.$store.commit('billing/resetInvoices')
      this.$router.push({
        path: `/billing?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}`
      })
    }
  },
  mounted () {
    this.getBillingInfoByClientId()
    this.$store.commit('billing/getCurrentMonth')
  },
  methods: {
    async getBillingInfoByClientId () {
      if (this.$route.params.search) {
        await this.$store.dispatch('billing/getBillingInfoByClientId', {
          clientId: this.$route.params.search,
          showPayed: this.showPayed,
          token: this.$store.state.auth.token
        })
      }
    },
    processAddresses (client) {
      if (!client) { return 'Sin Direccion' }
      const address = client?.address
      const addresses = client?.addresses
      if (address && !addresses) { return address }
      if (address && addresses.length === 0) { return address }
      if (!address && addresses.length < 1) { return 'Sin Dirección' }
      if (address && addresses.length > 0) { return addresses.at(-1).address }
      if (!address && addresses.length > 0) { return addresses.at(-1).address }
    },
    processAddressesNeighborhood (client) {
      if (!client) { return 'Sin Barrio' }
      const addresses = client.addresses
      const neighborhood = client.neighborhood
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
  max-height: calc(100vh - 168px);
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
