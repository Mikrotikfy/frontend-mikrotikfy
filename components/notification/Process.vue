<template>
  <v-container>
    <v-row>
      <v-col class="align-center d-flex">
        <v-btn
          color="primary"
          class="mr-2"
          :loading="loading"
          :disabled="loading || $store.state.notification.clients.length > 0"
          @click="getClientsFromCodes"
        >
          Generar Estados de Cuenta
        </v-btn>
        <v-btn
          class="mr-2"
          color="red"
          :loading="loading"
          :disabled="loading || $store.state.notification.clients.length < 1"
          @click="sendNotifications"
        >
          Enviar Notificaciones
        </v-btn>
        <span v-if="$store.state.notification.sendIndex > 0" class="text-h5">Enviados: <strong>{{ $store.state.notification.sendIndex }}</strong></span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-if="$store.state.notification.clients.length > 0"
          :headers="headers"
          :items="$store.state.notification.clients"
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
  props: {
    month: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      headers: [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Celular', value: 'phone', sortable: false },
        { text: 'Estado del envio', value: 'messageSent', sortable: false }
      ]
    }
  },
  methods: {
    async sendNotifications () {
      this.loading = true
      const clients = this.$store.state.notification.clients
      for (let i = 0; i < clients.length; i++) {
        await this.sleep(1500)
        this.$store.commit('notification/setSendIndex', i + 1)

        await this.$store.dispatch('notification/sendWhatsapp', {
          client: clients[i],
          token: this.$store.state.auth.token
        }).then((res) => {
          console.log(res)
          // let success = false
          // if (
          //   res &&
          //   res.contacts &&
          //   res.contacts[0]
          // ) {
          //   success = true
          // }
          // await this.$store.dispatch('notification/notificationSent', {
          //   token: this.$store.state.auth.token,
          //   index: i,
          //   success,
          //   city: this.$route.query.city,
          //   clienttype: this.$route.query.clienttype,
          //   client: clients[i]
          // })
        })
      }
      this.loading = false
    },
    async getClientsFromCodes () {
      this.loading = true
      const codes = this.$store.state.notification.codes
      const clients = await this.$store.dispatch('notification/getClients', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype
      })
      const search = codes.map((code) => {
        return clients.find((client) => {
          client.messageSent = null
          return client.code === code
        })
      })
      const filtered = search.filter(function (el) {
        return el !== undefined
      })
      for (let i = 0; i < filtered.length; i++) {
        await this.$store.dispatch('notification/createBillAccount', {
          token: this.$store.state.auth.token,
          index: i,
          city: this.$route.query.city,
          clienttype: this.$route.query.clienttype,
          client: filtered[i],
          month: this.month
        })
      }
      this.$store.commit('notification/setClients', filtered)
      this.$store.commit('notification/readyForSend')
      this.loading = false
    },
    sleep (time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time)
      })
    }
  }
}
</script>
