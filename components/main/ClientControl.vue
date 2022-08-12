<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          small
          rounded
          :color="$vuetify.theme.dark ? lastDebtMovement ? lastDebtMovement.isindebt ? 'red' : 'green darken-4' : 'white black--text' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <span>
            {{ lastDebtMovement ? lastDebtMovement.isretired ? 'RETIRADO' : lastDebtMovement.isindebt ? 'EN MORA' : 'AL DIA' : 'Control de Usuario' }}
          </span>
        </v-btn>
      </template>
      <span>Cambiar estado del cliente</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      width="90%"
      :fullscreen="!$store.state.isDesktop"
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
          Centro de Control de Usuario | {{ client.name }}
        </v-card-title>
        <v-divider />
        <v-row class="mt-2">
          <v-col cols="12" md="4" class="px-0 order-md-first order-lg-first" style="border-right:1px solid grey;">
            <MiscOfferHistory />
          </v-col>
          <v-col cols="12" md="4" class="px-0 order-first">
            <div style="display:grid;place-items:center;">
              <MainClientControlDebt :client="client" :index="index" />
              <MainClientControlOffer v-if="$isAdmin()" :client="client" :index="index" />
            </div>
          </v-col>
          <v-col cols="12" md="4" class="px-0" style="border-left:1px solid grey;">
            <MiscDebtHistory />
          </v-col>
        </v-row>
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
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      lastDebtMovement: null,
      modal: false
    }
  },
  watch: {
    async '$store.state.offer.newDebtHistory' () {
      this.getData()
      this.lastDebtMovement = await this.$store.dispatch('offer/getLastDebtMovement', {
        token: this.$store.state.auth.token,
        client: this.client
      })
    }
  },
  async mounted () {
    this.lastDebtMovement = await this.$store.dispatch('offer/getLastDebtMovement', {
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
    }
  }
}
</script>
