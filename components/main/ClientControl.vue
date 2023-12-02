<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          rounded
          :color="$vuetify.theme.dark ? service.indebt || !service.active ? 'red lighten-1' : 'white black--text' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <span v-if="service.name === 'INTERNET'">
            {{ !service.active ? 'RETIRADO' : service.indebt ? 'EN MORA' : ($isAdmin() || $isBiller()) ? `${service.offer ? service.offer.plan.name : 'NO DEF.'}` : 'AL DIA' }}
          </span>
          <span v-else>
            {{ !service.active ? 'RETIRADO' : service.indebt ? 'EN MORA' : `${service.offer ? 'AL DIA' : 'NO DEF.'}` }}
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
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="order-md-first order-lg-first">
              <MiscOfferHistory :service="service" style="border-right:1px solid grey;" />
            </v-col>
            <v-col cols="12" md="4" class="order-first">
              <div style="display:grid;place-items:center;">
                <MainClientControlDebt :service="service" />
                <MainClientControlOffer :service="service" />
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <MiscDebtHistory :service="service" style="border-left:1px solid grey;" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </span>
</template>
<script>
export default {
  name: 'ClientControl',
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modal: false
    }
  },
  methods: {
    initComponent () {
      if (this.$isAdmin() || this.$isBiller()) {
        this.modal = true
      }
    }
  }
}
</script>
