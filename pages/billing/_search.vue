<template>
  <v-container>
    <v-row>
      <v-col cols="5">
        <v-card class="rounded-xl">
          <v-card-title>
            <v-icon>mdi-account-circle</v-icon>
            <span class="headline ml-4">Buscando: {{ $route.params.search }}</span>
          </v-card-title>
          <v-card-text>
            <BillingClientSearch />
            <BillingClientList />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card class="rounded-xl">
          <v-card-title>
            <span class="headline ml-4">Movimientos de Cuenta</span>
          </v-card-title>
          <v-card-text>
            <BillingClientDetail />
          </v-card-text>
        </v-card>
        <v-card class="mt-5 rounded-xl">
          <v-card-text class="d-flex">
            <BillingClientDiscountAmount />
            <BillingClientAddAmount class="ml-4" />
          </v-card-text>
        </v-card>
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
