<template>
  <v-container fluid style="height:90vh; max-height:95vh;">
    <v-row>
      <BillingClientSearch />
    </v-row>
    <v-row>
      <v-col cols="5">
        <v-card class="rounded-xl">
          <v-card-text>
            <BillingClientList />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="7" class="parent">
        <v-card class="rounded-xl" style="overflow-y:scroll;">
          <v-card-title>
            <span class="headline ml-4">Movimientos de Cuenta</span>
            <v-spacer />
            <BillingPrintMovement />
          </v-card-title>
          <v-card-text>
            <BillingClientDetail />
          </v-card-text>
        </v-card>
        <v-card class="mt-2 rounded-xl d-flex align-center">
          <v-card-text>
            <BillingClientTotal />
          </v-card-text>
        </v-card>
        <BillingClientDiscountAmount />
        <BillingClientAddAmount />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  head () {
    return {
      title: 'Estado de Cuenta'
    }
  }
}
</script>
<style>
.parent {
  display: grid;
    grid-auto-rows: 8fr 1fr 1fr 1fr;
    grid-gap: 10px;
    max-height: 80vh;
}
</style>
