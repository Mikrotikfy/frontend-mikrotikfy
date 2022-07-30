<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          small
          rounded
          :color="$vuetify.theme.dark ? $store.state.offer.lastDebtMovement ? $store.state.offer.lastDebtMovement.isindebt ? 'red' : 'green darken-4' : 'white black--text' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <span>
            {{ $store.state.offer.lastDebtMovement ? $store.state.offer.lastDebtMovement.isindebt ? 'EN MORA' : 'AL DIA' : 'Control de Usuario' }}
          </span>
        </v-btn>
      </template>
      <span>Cambiar estado del cliente</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      width="90%"
      style="min-height: 500px;"
    >
      <v-toolbar>
        <v-btn
          icon
          @click="modal = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card>
        <v-card-title class="justify-center">
          Centro de Control de Usuario
        </v-card-title>
        <v-divider />
        <div class="mt-2 d-flex">
          <v-col cols="4" class="px-0" style="border-right:1px solid grey;">
            <MiscOfferHistory />
          </v-col>
          <v-col cols="4" class="px-0">
            <div style="display:grid;place-items:center;">
              <h2 class="mb-5">{{ client.name }}</h2>
              <MainClientControlDebt :client="client" />
              <MainClientControlOffer :client="client" />
            </div>
          </v-col>
          <v-col cols="4" class="px-0" style="border-left:1px solid grey;">
            <MiscDebtHistory />
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </span>
</template>
<script>
export default {
  name: 'ClientControl',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      message: 'Hello Vue!'
    }
  },
  watch: {
    '$store.state.offer.newDebtHistory' () {
      this.getData()
    }
  },
  mounted () {
    this.$store.dispatch('offer/getLastDebtMovement', {
      token: this.$store.state.auth.token,
      client: this.client
    })
  },
  methods: {
    initComponent () {
      this.modal = true
      this.getData()
    },
    getData () {
      this.$store.dispatch('offer/getOfferHistory', {
        client: this.client,
        token: this.$store.state.auth.token
      })
      this.$store.dispatch('offer/getDebtHistory', {
        client: this.client,
        token: this.$store.state.auth.token
      })
      this.$store.dispatch('offer/getLastDebtMovement', {
        token: this.$store.state.auth.token,
        client: this.client
      })
    }
  }
}
</script>
