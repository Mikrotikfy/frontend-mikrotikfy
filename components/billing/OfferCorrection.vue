<template>
  <span class="d-flex">
    <v-btn
      class="mr-4"
      elevation="0"
      block
      color="secondary"
      @click="offerCorrectionDialog = true"
    >
      Revisar Tarifas Faltantes
    </v-btn>
    <v-dialog v-model="offerCorrectionDialog" max-width="1100px" :retain-focus="false" :fullscreen="!$store.state.isDesktop">
      <v-card>
        <v-card-title>
          <v-toolbar
            dark
          >
            <v-btn
              icon
              dark
              @click="offerCorrectionDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Revisar Tarifas Faltantes</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="services"
            :loading="loading"
            :items-per-page="10"
          >
            <template v-slot:[`item.offer`]="{ item }">
              <v-autocomplete
                v-model="item.offer"
                :items="offers"
                item-text="name"
                item-value="id"
                class="mr-2"
                outlined
                dense
                return-object
                hide-details="auto"
                label="Aplicar tarifas"
                @change="updateOfferForService(item)"
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </span>
</template>
<script>
/* eslint-disable vue/prop-name-casing */
export default {
  name: 'OfferCorrection',
  props: {
    services: {
      type: Array,
      default: () => []
    }
  },
  data: () => {
    return {
      valid: false,
      offerCorrectionDialog: false,
      loading: false,
      headers: [
        { text: '#', value: 'id' },
        { text: 'Codigo', value: 'code' },
        { text: 'Cliente', value: 'normalized_client.name' },
        { text: 'Plan', value: 'plan.name' },
        { text: 'Tarifa', value: 'offer' }
      ]
    }
  },
  computed: {
    offers () {
      return this.$store.state.offer.offers
    }
  },
  mounted () {
    this.getOffers()
  },
  methods: {
    async getOffers () {
      await this.$store.dispatch('offer/getOffers', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype
      })
    },
    updateOfferForService (service) {
      this.$store.dispatch('client/updateOfferForService', { service, token: this.$store.state.auth.token })
    }
  }
}
</script>
