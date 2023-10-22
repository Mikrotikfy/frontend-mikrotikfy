<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :color="$vuetify.theme.dark ? 'primary' : 'white'"
          class="ml-3"
          v-on="on"
          @click="initComponent"
        >
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </template>
      <span>Historial de Direcciones</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="800"
    >
      <v-card>
        <v-card-title class="headline">
          Historial de direcciones del cliente
        </v-card-title>
        <v-card-text v-if="addresses">
          <v-row>
            <v-col>
              <p
                v-for="(address, index) in addresses"
                :key="index"
              >
                {{ address.id }} - {{ address ? address.address : null }} - {{ address && address.neighborhood ? address.neighborhood.name : null }} - {{ getDate(address.createdAt) }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          No hay direcciones asiganadas para este usuario...
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="green darken-4"
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      modal: false
    }
  },
  computed: {
    addresses () {
      return this.$store.state.address.serviceAddresses
    }
  },
  methods: {
    async initComponent () {
      this.modal = true
      await this.$store.dispatch('address/getAddressByServiceId', {
        serviceId: this.service.id,
        token: this.$store.state.auth.token
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    processAddresses ({ client }) {
      if (!client) { return 'Sin Direccion' }
      const address = client?.address
      const addresses = client?.addresses
      if (!address && !addresses) { return 'Sin Dirección' }
      if (address && !addresses) { return client.address }
      if (address && addresses.length > 0) { return addresses.at(-1).address }
      if (!address && addresses.length > 0) { return addresses.at(-1).address }
    },
    processAddressesNeighborhood ({ client }) {
      if (!client) { return 'Sin Barrio' }
      const addresses = client.addresses3
      const neighborhood = client.neighborhood
      if (!neighborhood && !addresses) { return 'Sin Barrio' }
      if (neighborhood && !addresses) { return neighborhood.name }
      if (neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
      if (!neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (!neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
    }
  }
}
</script>
