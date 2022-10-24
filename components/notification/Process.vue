<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          class="mr-2"
          :loading="loading"
          :disabled="loading || $store.state.notification.clients.length > 0"
          @click="getClientsFromCodes"
        >
          Buscar Clientes
        </v-btn>
        <v-btn
          color="red"
          :loading="loading"
          :disabled="loading || $store.state.notification.clients.length < 1"
          @click="sendNotifications"
        >
          Enviar Notificaciones
        </v-btn>
        <span v-if="$store.state.notification.sendIndex > 0" class="text-h5">Enviando: <strong>{{ $store.state.notification.sendIndex }}</strong></span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-if="$store.state.notification.clients.length > 0"
          :headers="headers"
          :items="$store.state.notification.clients"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      headers: [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Celular', value: 'phone', sortable: false }
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
        }).then(async (res) => {
          console.log(res)
          let success = false
          if (
            res &&
            res.contacts &&
            res.contacts[0]
          ) {
            success = true
          }
          await this.$store.dispatch('notification/notificationSent', {
            token: this.$store.state.auth.token,
            index: i,
            success,
            city: this.$route.query.city,
            clienttype: this.$route.query.clienttype,
            client: clients[i]
          })
        })
      }
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
          return client.code === code
        })
      })
      this.$store.commit('notification/setClients', search)
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
