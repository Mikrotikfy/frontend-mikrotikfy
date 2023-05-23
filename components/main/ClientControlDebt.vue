<template>
  <div style="width:100%;">
    <div class="mb-5" style="display:grid;place-items:center;">
      <v-alert
        text
        tile
        dense
        :color="!client.active ? 'warning' : client.indebt ? 'error' : 'success'"
        style="width:100%;"
        class="text-center"
      >
        El Cliente esta {{ !client.active ? 'RETIRADO' : client.indebt ? 'EN MORA' : 'AL DIA' }}
      </v-alert>
      <v-btn
        :disabled="!($isAdmin() || $isBiller())"
        :color="!client.active ? 'green darken-4' : client.indebt ? 'blue darken-4' : 'red'"
        x-large
        rounded
        @click="buttonHandler(!client.active ? 'reconnect' : client.indebt ? 'reconnect' : 'disconnect' )"
      >
        <v-icon>{{ !client.active ? 'mdi-check-all' : client.indebt ? 'mdi-check-all' : 'mdi-cancel' }}</v-icon>
        {{ !client.active ? 'REACTIVAR' : client.indebt ? 'RECONECTAR' : 'CORTAR' }}
      </v-btn>
      <span v-if="!client.indebt && !!client.active" class="text-subtitle-2 grey--text lighten-2 mt-2">Para retirar el cliente es necesario antes cortarlo</span>
    </div>
    <div v-if="client.indebt && !!client.active" class="mb-5" style="display:grid;place-items:center;">
      <v-btn
        :disabled="!($isAdmin() || $isBiller())"
        color="yellow darken-4"
        x-large
        rounded
        @click="!client.active ? buttonHandler('retire') : reasonDialog = true">
        <v-icon>mdi-cancel</v-icon>
        {{ !client.active ? 'REACTIVAR' : 'RETIRAR' }}
      </v-btn>
    </div>
    <v-dialog
      v-model="reasonDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Retirar cliente
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="reason"
            label="Razon de retiro"
            outlined
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="buttonHandler('retire')"
          >
            Retirar Cliente
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'ClientControlDebt',
  props: {
    client: {
      type: Object,
      required: true
    },
    lastdebtmovement: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      offers: [],
      reason: '',
      reasonDialog: false
    }
  },
  computed: {
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    city () {
      return this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
    }
  },
  methods: {
    buttonHandler (operation) {
      this.$toast.info(operation, { duration: 1000 })
      switch (operation) {
        case 'reconnect':
          this.editClientStatus({
            active: true,
            indebt: false,
            comment: ''
          })
          break
        case 'disconnect':
          this.editClientStatus({
            active: true,
            indebt: true,
            comment: ''
          })
          break
        case 'retire':
          if (this.reason === '') {
            this.$toast.error('Debe ingresar una razon de retiro', { duration: 10000 })
            break
          }
          this.editClientStatus({
            active: false,
            indebt: false,
            comment: this.reason
          })
          this.reasonDialog = false
          break
        default:
          break
      }
    },
    async editClientStatus (payload) {
      await this.$store.dispatch('client/editClientStatus', {
        token: this.$store.state.auth.token,
        client: this.client,
        indebt: payload.indebt,
        active: payload.active
      })
      await this.$store.dispatch('offer/setNewDebt', {
        city: this.city,
        client: this.client,
        token: this.$store.state.auth.token,
        technician: this.$store.state.auth,
        isindebt: payload.indebt,
        isretired: !payload.active,
        comment: payload.comment
      })
      this.$simpleTelegramUpdateDebt({
        client: this.client,
        operator: this.$store.state.auth.username,
        indebt: payload.indebt,
        active: payload.active,
        telegramBots: this.telegramBots
      })
      if (this.$route.query.clienttype === 'INTERNET') {
        this.$store.dispatch('client/setPlanFromModal', {
          clientId: this.client.id,
          clientIndex: this.index,
          isOfferChange: false,
          kick: true,
          newPlan: this.calculateClientNewPlan(payload.indebt, payload.active, this.client),
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
      }
      this.resetSearch()
    },
    calculateClientNewPlan (indebt, active, client) {
      if (indebt && active) { return { id: 7 } }
      if (!indebt && !active) { return { id: 8 } }
      if (!indebt && active) { return client.offer.plan }
    },
    async resetSearch () {
      await this.$store.dispatch('client/getUsersFromDatabaseBySearch', { search: this.$route.params.search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token, pagination: { page: 1, pageSize: 500 } })
    },
    isInDebtByPlan (plan) {
      if (plan.name === 'RETIRADO' || plan.name === 'EN MORA') {
        return true
      } else {
        return false
      }
    },
    getState (plan) {
      if (plan === 'EN MORA') {
        return 'EN MORA'
      } else if (plan === 'RETIRADO') {
        return 'RETIRADO'
      } else {
        return 'AL DIA'
      }
    }
  }
}
</script>
