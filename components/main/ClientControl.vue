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
            {{ lastDebtMovement ? lastDebtMovement.isretired ? 'RETIRADO' : lastDebtMovement.isindebt ? 'EN MORA' : `AL DIA | ${client.offer.plan.name}` : 'Control de Usuario' }}
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
      <v-card>
        <v-card-title class="justify-center">
          <v-spacer />
          <v-btn
            icon
            @click="modal = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-row>
          <v-col cols="12" md="4" class="order-md-first order-lg-first">
            <MiscOfferHistory :client="client" style="border-right:1px solid grey;" />
          </v-col>
          <v-col cols="12" md="4" class="order-first">
            <div style="display:grid;place-items:center;">
              <MainClientControlDebt :client="client" :lastdebtmovement="lastDebtMovement" :index="index" />
              <MainClientControlOffer :client="client" :lastoffermovement="lastOfferMovement" :index="index" @resetSearch="getMovements" />
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <MiscDebtHistory :client="client" style="border-left:1px solid grey;" />
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
      lastOfferMovement: null,
      modal: false
    }
  },
  async mounted () {
    await this.getMovements()
  },
  methods: {
    async initComponent () {
      this.modal = true
      this.lastOfferMovement = await this.$store.dispatch('offer/getLastOfferMovement', {
        token: this.$store.state.auth.token,
        client: this.client
      })
    },
    async getMovements () {
      this.lastDebtMovement = await this.$store.dispatch('offer/getLastDebtMovement', {
        token: this.$store.state.auth.token,
        client: this.client
      })
    }
  }
}
</script>
