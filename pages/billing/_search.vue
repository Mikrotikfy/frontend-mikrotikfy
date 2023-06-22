<template>
  <v-container fluid style="height:calc(100vh - 48px);">
    <BillingClientSearch class="mt-1" />
    <v-row class="mt-0">
      <v-col cols="5">
        <v-card class="rounded-lg">
          <v-card-text>
            <BillingClientList />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="7" class="parent">
        <v-card class="rounded-lg" style="overflow-y:scroll;">
          <v-card-title>
            <span :class="this.$store.state.billing.showArchive ? 'headline ml-4 red darken-4 rounded-lg px-2' : 'headline ml-4'">{{ this.$store.state.billing.showArchive ? 'ARCHIVO DE CUENTA' : 'Movimiento de Cuenta' }}</span>
            <v-spacer />
            <BillingToggleArchive />
            <BillingPrintMovement />
          </v-card-title>
          <v-card-text style="height:80%;">
            <BillingClientDetail />
          </v-card-text>
          <v-card-actions style="position: absolute;bottom: 0;border-top:grey solid 1px;width:100%;" class="d-flex pl-6">
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
</style>
