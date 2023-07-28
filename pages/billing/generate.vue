<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-center mb-4">
          Generar Estados de Cuenta de {{ $route.query.clienttype}} para {{ $route.query.city }}
        </h2>
        <BillingSelectMonth />
        <v-card v-if="month" class="rounded-xl mx-auto elevation-0" width="1200">
          <v-card-text>
            <v-stepper v-model="e1" class="transparent elevation-0">
              <v-stepper-header class="elevation-0">
                <v-stepper-step
                  :complete="e1 > 1"
                  step="1"
                >
                  Clientes Activos: <strong>{{ activeClients.length }}</strong>
                </v-stepper-step>

                <v-divider />
                <v-stepper-step
                  :complete="e1 > 2"
                  step="2"
                >
                  Generar Estados de Cuenta
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <BillingPrepare />
                </v-stepper-content>

                <v-stepper-content step="2">
                  <BillingProcess />
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Notification',
  computed: {
    month () {
      return this.$store.state.billing.month
    },
    e1 () {
      return this.$store.state.billing.e1
    },
    activeClients () {
      return this.$store.state.billing.activeClients
    }
  },
  head () {
    return {
      title: 'Notificacion Masiva'
    }
  }
}
</script>
