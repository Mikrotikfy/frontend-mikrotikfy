<template>
  <v-container fluid style="height:calc(100vh - 48px);">
    <BillingClientSearch class="mt-1" />
    <v-row class="mt-0">
      <v-col cols="5" class="parent-container">
        <div class="parent-list">
          <v-card class="rounded-lg">
            <v-card-text>
              <BillingClientList />
            </v-card-text>
          </v-card>
          <v-card class="rounded-lg">
            <v-card-text>
              <BillingLegalNotesList />
            </v-card-text>
          </v-card>
        </div>
      </v-col>
      <v-col cols="7" class="parent">
        <v-card class="rounded-lg">
          <v-card-title>
            <span :class="this.$store.state.billing.showPayed ? 'ml-4 red darken-4 rounded-lg px-2' : 'ml-2'">{{ this.$store.state.billing.showPayed ? 'ARCHIVO DE CUENTA' : 'Estado de Cuenta' }}</span> <span v-if="currentClient" ref="clientP" class="ml-1 hideMe rounded-xl px-2 text-body-1">
              {{ currentClient.id }} {{ currentClient.name }}
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
      return this.$store.state.billing.currentClient
    }
  },
  mounted () {
    this.$store.commit('billing/getCurrentMonth')
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
  grid-auto-rows: minmax(1fr, 50vh) minmax(1fr, auto);
  grid-gap: 10px;
}
.parent-container {
  max-height: calc(100vh - 168px);
  overflow-y: scroll;
}
</style>
