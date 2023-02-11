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
        :color="!client.active ? 'green darken-4' : client.indebt ? 'blue darken-4' : 'red'"
        x-large
        rounded
        @click="buttonHandler(!client.active ? 'rx' : client.indebt ? 'rx' : 'dx' )"
      >
        <v-icon>{{ !client.active ? 'mdi-check-all' : client.indebt ? 'mdi-check-all' : 'mdi-cancel' }}</v-icon>
        {{ !client.active ? 'REACTIVAR' : client.indebt ? 'RECONECTAR' : 'CORTAR' }}
      </v-btn>
      <span v-if="!client.indebt && !!client.active" class="text-subtitle-2 grey--text lighten-2 mt-2">Para retirar el cliente es necesario antes cortarlo</span>
    </div>
    <div v-if="client.indebt && !!client.active" class="mb-5" style="display:grid;place-items:center;">
      <v-btn color="yellow darken-4" x-large rounded @click="!client.active ? setRetired : reasonDialog = true">
        <v-icon>mdi-cancel</v-icon>
        {{ buttonHandler(!client.active ? 'rx' : 'rt') }}
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
            @click="setRetired"
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
      switch (operation) {
        case 'rx':
          this.editClientStatus({
            active: true,
            indebt: false
          })
          break
        case 'dx':
          this.editClientStatus({
            active: false,
            indebt: true
          })
          break
        case 'rt':
          this.editClientStatus({
            active: false,
            indebt: false
          })
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
        isretired: !payload.active
      })
      this.$simpleTelegramUpdateDebt({
        client: this.client,
        operator: this.$store.state.auth.username,
        isInDebt: payload.indebt,
        isRetired: !payload.active,
        telegramBots: this.telegramBots
      })
      this.$store.dispatch('client/setPlanFromModal', {
        clientId: this.client.id,
        clientIndex: this.index,
        isOfferChange: false,
        kick: true,
        newPlan: payload.indebt ? { id: 7 } : this.client.offer.plan,
        operator: this.$store.state.auth.id,
        token: this.$store.state.auth.token
      })
      this.resetSearch()
    },
    async setRetired () {
      if (this.reason === '') {
        this.$toast.error('Debe ingresar una razon de retiro', { duration: 10000 })
        return
      }
      await this.$store.dispatch('client/retireClient', {
        token: this.$store.state.auth.token,
        client: this.client,
        indebt: false,
        active: false
      })
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        city: this.city,
        isindebt: this.isInDebt,
        isretired: !this.isRetired,
        client: this.client,
        technician: this.$store.state.auth,
        comment: this.reason
      }).then(() => {
        this.$simpleTelegramUpdateDebt({ client: this.client, operator: this.$store.state.auth.username, isInDebt: this.isInDebt, isRetired: !this.isRetired, telegramBots: this.telegramBots })
        this.$store.dispatch('client/setPlanFromModal', {
          clientId: this.client.id,
          clientIndex: this.index,
          isOfferChange: false,
          kick: true,
          newPlan: !this.isRetired === true ? { id: 8 } : this.$store.state.offer.offerHistory[0].offer.plan,
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
        this.resetSearch()
        this.reasonDialog = false
      })
    },
    async undoRetire () {
      await this.$store.dispatch('client/undoRetireClient', {
        token: this.$store.state.auth.token,
        client: this.client,
        indebt: false,
        active: true
      })
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        city: this.city,
        isindebt: false,
        isretired: false,
        client: this.client,
        technician: this.$store.state.auth,
        comment: ''
      }).then(() => {
        this.$simpleTelegramUpdateDebt({ client: this.client, operator: this.$store.state.auth.username, isInDebt: false, isRetired: false, telegramBots: this.telegramBots })
        this.$store.dispatch('client/setPlanFromModal', {
          clientId: this.client.id,
          clientIndex: this.index,
          isOfferChange: false,
          kick: true,
          newPlan: !this.isRetired === true ? { id: 8 } : this.$store.state.offer.offerHistory[0].offer.plan,
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
        this.resetSearch()
        this.reasonDialog = false
      })
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
