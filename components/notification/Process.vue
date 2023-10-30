<template>
  <v-container>
    <v-row>
      <v-col class="align-center d-flex">
        <v-btn
          color="primary"
          class="mr-2"
          :loading="loading"
          :disabled="loading || services.length > 0"
          @click="generateBilling"
        >
          Generar Estados de Cuenta
        </v-btn>
        <v-btn
          class="mr-2"
          color="red"
          :loading="loading"
          :disabled="loading || services.length < 1 || ended"
          @click="sendNotifications"
        >
          Enviar Notificaciones
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span v-if="sendIndex > 0" class="text-h5">Enviados: <strong>{{ sendIndex }}</strong></span>
        <span v-if="generatedBills > 0" class="text-h5">Cargados: <strong>{{ generatedBills }}</strong></span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-if="services.length > 0"
          :headers="headers"
          :items="services"
        >
          <template v-slot:[`item.messageSent`]="{ item }">
            <v-chip
              v-if="item.messageSent"
              :color="item.messageSent ? 'green' : 'red'"
              text-color="white"
            >
              {{ item.messageSent ? 'ENVIADO' : 'FALLIDO' }}
            </v-chip>
            <v-chip
              v-else
              :color="'cyan darken-4'"
              text-color="white"
            >
              PENDIENTE
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      generatedBills: 0,
      ended: false,
      headers: [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Celular', value: 'normalized_client.phone', sortable: false },
        { text: 'Estado del envio', value: 'messageSent', sortable: false }
      ]
    }
  },
  computed: {
    sendIndex () {
      return this.$store.state.notification.sendIndex
    },
    services () {
      return this.$store.state.notification.services
    },
    month () {
      return this.$store.state.notification.month
    },
    year () {
      return this.$store.state.notification.year
    }
  },
  methods: {
    async sendNotifications () {
      this.loading = true
      const services = this.services

      for (let i = 0; i < services.length; i++) {
        this.$store.commit('notification/setSendIndex', i + 1)

        await this.$store.dispatch('notification/sendWhatsapp', {
          service: services[i],
          month: this.month,
          token: this.$store.state.auth.token
        }).then(async (res) => {
          let success = false
          if (
            res &&
            res.contacts &&
            res.contacts[0]
          ) {
            success = true
          }
          await this.$store.dispatch('notification/updateSentStatus', {
            token: this.$store.state.auth.token,
            index: i,
            success,
            city: this.$route.query.city,
            clienttype: this.$route.query.clienttype,
            service: services[i]
          })
        })
      }
      this.loading = false
      this.ended = true
    },
    async generateBilling () {
      this.loading = true
      const codes = this.$store.state.notification.codes
      const services = await this.$store.dispatch('notification/getServices', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        month: this.month,
        year: this.year
      })
      const search = codes.map((code) => {
        return services.find((service) => {
          service.messageSent = null
          return service.code === code
        })
      })

      const filtered = search.filter(function (el) {
        return el !== undefined
      })

      for (let i = 0; i < filtered.length; i++) {
        await this.$store.dispatch('notification/createBillAccount', {
          token: this.$store.state.auth.token,
          city: this.$route.query.city,
          clienttype: this.$route.query.clienttype,
          service: filtered[i],
          month: this.month,
          year: this.year
        })
        this.generatedBills++
      }
      this.$store.commit('notification/setServices', filtered)
      this.$store.commit('notification/readyForSend')
      this.loading = false
    }
  }
}
</script>
