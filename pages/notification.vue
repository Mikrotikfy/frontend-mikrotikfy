<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-center">
          Control de Tarifa de Usuarios
        </h2>
        <NotificationSelectMonth />
        <v-card v-if="month" class="rounded-xl">
          <v-card-title>
            Notificacion masiva a usuarios
          </v-card-title>
          <v-card-text>
            <v-stepper v-model="e1">
              <v-stepper-header>
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

                <v-divider />

                <v-stepper-step step="3">
                  Resumen de operacion
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <NotificationPrepare />
                </v-stepper-content>

                <v-stepper-content step="2">
                  <NotificationProcess />
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-btn
                    color="primary"
                    @click="e1 = 1"
                  >
                    Continue
                  </v-btn>

                  <v-btn text>
                    Cancel
                  </v-btn>
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
