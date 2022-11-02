<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="rounded-xl">
          <v-card-title>
            Notificacion masiva a usuarios
          </v-card-title>
          <v-card-text v-if="e1 === 1">
            <v-select
              v-model="month"
              :items="months"
              label="Mes a facturar"
              filled
              rounded
            />
          </v-card-text>
          <v-card-text v-if="month">
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
                  <v-btn
                    :disabled="!$store.state.notification.readyForSend"
                    color="primary"
                    class="mt-2"
                    @click="e1 = 2"
                  >
                    Continuar
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <NotificationProcess :month="month" />
                  <v-btn
                    color="primary"
                    @click="e1 = 3"
                  >
                    Continue
                  </v-btn>

                  <v-btn text>
                    Cancel
                  </v-btn>
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
  data () {
    return {
      e1: 1,
      message: 'Hello Vue!',
      month: null,
      months: [
        {
          text: 'Enero',
          value: '1'
        },
        {
          text: 'Febrero',
          value: '2'
        },
        {
          text: 'Marzo',
          value: '3'
        },
        {
          text: 'Abril',
          value: '4'
        },
        {
          text: 'Mayo',
          value: '5'
        },
        {
          text: 'Junio',
          value: '6'
        },
        {
          text: 'Julio',
          value: '7'
        },
        {
          text: 'Agosto',
          value: '8'
        },
        {
          text: 'Septiembre',
          value: '9'
        },
        {
          text: 'Octubre',
          value: '10'
        },
        {
          text: 'Noviembre',
          value: '11'
        },
        {
          text: 'Diciembre',
          value: '12'
        }
      ]
    }
  },
  watch: {
    month () {
      this.getListOfBills()
    }
  },
  methods: {
    getListOfBills () {
      this.$store.dispatch('notification/getListOfBills', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        month: this.month
      })
    }
  },
  head () {
    return {
      title: 'Notificacion Masiva'
    }
  }
}
</script>
