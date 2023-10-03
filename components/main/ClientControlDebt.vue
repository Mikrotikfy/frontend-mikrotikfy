<template>
  <div style="width:100%;">
    <div class="mb-5" style="display:grid;place-items:center;">
      <v-alert
        text
        tile
        dense
        :color="!service.active ? 'warning' : service.indebt ? 'error' : 'success'"
        style="width:100%;"
        class="text-center"
      >
        El Cliente esta {{ !service.active ? 'RETIRADO' : service.indebt ? 'EN MORA' : 'AL DIA' }} | Saldo: {{ service.balance }}
      </v-alert>
      <v-btn
        :disabled="!($isAdmin() || $isBiller())"
        :color="!service.active ? 'green darken-4' : service.indebt ? 'blue darken-4' : 'red'"
        x-large
        rounded
        @click="buttonHandler(!service.active ? 'reconnect' : service.indebt ? 'reconnect' : 'disconnect' )"
      >
        <v-icon>{{ !service.active ? 'mdi-check-all' : service.indebt ? 'mdi-check-all' : 'mdi-cancel' }}</v-icon>
        {{ !service.active ? 'REACTIVAR' : service.indebt ? 'RECONECTAR' : 'CORTAR' }}
      </v-btn>
      <span v-if="!service.indebt && !!service.active" class="text-subtitle-2 grey--text lighten-2 mt-2">Para retirar el cliente es necesario antes cortarlo</span>
    </div>
    <div v-if="service.indebt && !!service.active" class="mb-5" style="display:grid;place-items:center;">
      <v-btn
        :disabled="!($isAdmin() || $isBiller())"
        color="yellow darken-4"
        x-large
        rounded
        @click="!service.active ? buttonHandler('retire') : reasonDialog = true"
      >
        <v-icon>mdi-cancel</v-icon>
        {{ !service.active ? 'REACTIVAR' : 'RETIRAR' }}
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
    service: {
      type: Object,
      required: true
    },
    lastdebtmovement: {
      type: Object,
      default: () => ({})
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
        service: this.service,
        indebt: payload.indebt,
        active: payload.active
      })
      await this.$store.dispatch('offer/setNewDebt', {
        city: this.city,
        service: this.service,
        token: this.$store.state.auth.token,
        technician: this.$store.state.auth,
        isindebt: payload.indebt,
        isretired: !payload.active,
        comment: payload.comment
      })
      // this.$simpleTelegramUpdateDebt({
      //   service: this.service,
      //   operator: this.$store.state.auth.username,
      //   indebt: payload.indebt,
      //   active: payload.active,
      //   telegramBots: this.telegramBots
      // })
      if (this.service.name === 'INTERNET') {
        this.$store.dispatch('client/setPlanFromModal', {
          serviceId: this.service.id,
          isOfferChange: false,
          kick: true,
          newPlan: this.calculateServiceNewPlan(payload.indebt, payload.active, this.service),
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
      }
      this.$store.commit('client/refresh') // this one refreshes the service when in billing interface
      this.$store.commit('billing/refresh') // this one refreshes the client when in billing interface
    },
    calculateServiceNewPlan (indebt, active, service) {
      if (indebt && active) { return { id: 7 } }
      if (!indebt && !active) { return { id: 8 } }
      if (!indebt && active) { return service.offer.plan }
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
