<template>
  <v-container>
    <v-row class="justify-center">
      <v-card class="rounded-xl" width="800">
        <v-card-title>
          <v-icon>mdi-account-circle</v-icon>
          <span class="headline ml-4">Clientes</span>
        </v-card-title>
        <v-card-text>
          <BillingClientSearch />
        </v-card-text>
      </v-card>
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
