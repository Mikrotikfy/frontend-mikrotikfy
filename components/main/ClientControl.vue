<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          small
          rounded
          :color="$vuetify.theme.dark ? client.indebt || !client.active ? 'red darken-4' : 'white black--text' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <span v-if="$route.query.clienttype === 'INTERNET'">
            {{ !client.active ? 'RETIRADO' : client.indebt ? 'EN MORA' : `${client.offer ? client.offer.plan ? client.offer.plan.name : 'NO DEF.' : 'NO DEF.'}` }}
          </span>
          <span v-else>
            {{ !client.active ? 'RETIRADO' : client.indebt ? 'EN MORA' : 'AL DIA' }}
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
              <MiscOfferHistory :client="client" style="border-right:1px solid grey;" />
            </v-col>
            <v-col cols="12" md="4" class="order-first">
              <div style="display:grid;place-items:center;">
                <MainClientControlDebt :client="client" :index="index" />
                <MainClientControlOffer :client="client" :index="index" />
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <MiscDebtHistory :client="client" style="border-left:1px solid grey;" />
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
      modal: false
    }
  },
  methods: {
    initComponent () {
      this.modal = true
    }
  }
}
</script>
