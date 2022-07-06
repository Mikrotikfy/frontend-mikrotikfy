<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-wan</v-icon>
          <span v-if="block">
            Modelo IP
          </span>
        </v-btn>
      </template>
      <span>Modelo IP</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="990"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Modelo IP de {{ client.name }}
        </v-card-title>
        <div v-if="!loading">
          <v-card-text v-if="client.ipmodel === null || client.ipmodel === 0">
            <h1>Cliente PPPoE</h1>
            <p>Habilita el cliente como IP ESTATICA para acceder a su configuracion en este menu</p>
          </v-card-text>
          <v-card-text v-else>
            <IpmodelEditModel v-if="$store.state.ipmodel.currentClientHasStaticIp" />
            <IpmodelCreateModel v-else :init="modal" />
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'IpModel',
  props: {
    client: {
      type: Object,
      default: () => ({})
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false,
    loading: true,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    devices: []
  }),
  methods: {
    initComponent () {
      this.modal = true
      this.loading = false
      this.$store.dispatch('ipmodel/getLast', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
      this.$store.dispatch('ipmodel/clientHasModel', {
        clientId: this.client.id,
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getColor (state) {
      if (state) {
        return 'blue darken-4'
      } else {
        return 'red'
      }
    },
    getState (state) {
      if (state) {
        return 'Abierto'
      } else {
        return 'Cerrado'
      }
    }
  }
}
</script>

<style>

</style>
