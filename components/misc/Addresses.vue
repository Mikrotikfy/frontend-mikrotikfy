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
        <v-card-text>
          <v-row>
            <v-col>
              <p
                v-for="(address, index) in addresses"
                :key="index"
              >
                {{ address.address }} - {{ address.neighborhood.name }} - {{ getDate(address.createdAt) }}
              </p>
            </v-col>
          </v-row>
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
    client: {
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
      return this.$store.state.address.clientAddresses
    }
  },
  methods: {
    async initComponent () {
      this.modal = true
      await this.$store.dispatch('address/getAddresByClientId', {
        clientId: this.client.id,
        token: this.$store.state.auth.token
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
