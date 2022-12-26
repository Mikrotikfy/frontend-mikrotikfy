<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-center mb-4">
          Envío de Estado de Cuenta Mensual
        </h2>
        <NotificationSelectMonth />
        <v-card v-if="month" class="rounded-xl mx-auto elevation-0" width="800">
          <v-card-text>
            <v-stepper v-model="e1" class="transparent elevation-0">
              <v-stepper-header class="elevation-0">
                <v-stepper-step
                  :complete="e1 > 1"
                  step="1"
                >
                  Listado de Facturas
                </v-stepper-step>

                <v-divider />
                <v-stepper-step
                  :complete="e1 > 2"
                  step="2"
                >
                  Envio de Notificaciones
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <NotificationPrepare />
                </v-stepper-content>

                <v-stepper-content step="2">
                  <NotificationProcess />
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
      return this.$store.state.notification.month
    },
    e1 () {
      return this.$store.state.notification.e1
    }
  },
  head () {
    return {
      title: 'Notificacion Masiva'
    }
  }
}
</script>
