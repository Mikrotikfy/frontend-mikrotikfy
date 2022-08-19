<template>
  <div>
    <div v-if="isInDebt !== null" class="mb-5" style="display:grid;place-items:center;">
      <v-alert text prominent :type="isRetired ? 'warning' : isInDebt ? 'error' : 'success'">
        El Cliente esta {{ isRetired ? 'RETIRADO' : isInDebt ? 'EN MORA' : 'AL DIA' }}
      </v-alert>
      <v-btn :color="isRetired ? 'green darken-4' : isInDebt ? 'blue darken-4' : 'red'" x-large rounded @click="setNewDebt">
        <v-icon>{{ isRetired ? 'mdi-check-all' : isInDebt ? 'mdi-check-all' : 'mdi-cancel' }}</v-icon>
        {{ isRetired ? 'REACTIVAR' : isInDebt ? 'RECONECTAR' : 'CORTAR' }}
      </v-btn>
      <span v-if="!isInDebt && !isRetired" class="text-subtitle-2 grey--text lighten-2 mt-2">Para retirar el cliente es necesario antes cortarlo</span>
    </div>
    <div v-if="isInDebt && !isRetired" class="mb-5" style="display:grid;place-items:center;">
      <v-btn color="yellow darken-4" x-large rounded @click="setRetired">
        <v-icon>mdi-cancel</v-icon>
        {{ isRetired ? 'REACTIVAR' : 'RETIRAR' }}
      </v-btn>
    </div>
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
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isInDebt: null,
      isRetired: null,
      offers: []
    }
  },
  computed: {
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  mounted () {
    this.getLastDebtMovement()
  },
  methods: {
    async setNewDebt () {
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        isindebt: !this.isInDebt,
        isretired: this.isRetired ? !this.isRetired : this.isRetired,
        client: this.client,
        technician: this.$store.state.auth
      }).then(() => {
        this.$simpleTelegramUpdateDebt({ client: this.client, operator: this.$store.state.auth.username, isInDebt: !this.isInDebt, isRetired: this.isRetired, telegramBots: this.telegramBots })
        this.getLastDebtMovement()
        this.$store.dispatch('client/setPlanFromModal', {
          clientId: this.client.id,
          clientIndex: this.index,
          isOfferChange: false,
          kick: true,
          newPlan: !this.isInDebt === true ? { id: 7 } : this.client.offer,
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
      })
    },
    async setRetired () {
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        isindebt: this.isInDebt,
        isretired: !this.isRetired,
        client: this.client,
        technician: this.$store.state.auth
      }).then(() => {
        this.$simpleTelegramUpdateDebt({ client: this.client, operator: this.$store.state.auth.username, isInDebt: this.isInDebt, isRetired: !this.isRetired, telegramBots: this.telegramBots })
        this.getLastDebtMovement()
        this.$store.dispatch('client/setPlanFromModal', {
          clientId: this.client.id,
          clientIndex: this.index,
          isOfferChange: false,
          kick: true,
          newPlan: !this.isRetired === true ? { id: 8 } : this.client.offer,
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
      })
    },
    async getLastDebtMovement () {
      const res = await this.$store.dispatch('offer/getLastDebtMovement', {
        client: this.client,
        token: this.$store.state.auth.token
      })
      if (res) {
        this.isInDebt = res.isindebt
        this.isRetired = res.isretired
      } else {
        await this.$store.dispatch('offer/setNewDebt', {
          token: this.$store.state.auth.token,
          isindebt: this.isInDebtByPlan(this.client.plan),
          client: this.client,
          technician: this.$store.state.auth
        })
        await this.$store.dispatch('offer/getDebtHistory', {
          client: this.client,
          token: this.$store.state.auth.token
        })
        this.getLastDebtMovement()
      }
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
