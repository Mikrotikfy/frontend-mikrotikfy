<template>
  <div style="width:100%;">
    <div v-if="isInDebt !== null" class="mb-5" style="display:grid;place-items:center;">
      <v-alert
        text
        tile
        dense
        :color="isRetired ? 'warning' : isInDebt ? 'error' : 'success'"
        style="width:100%;"
        class="text-center"
      >
        El Cliente esta {{ isRetired ? 'RETIRADO' : isInDebt ? 'EN MORA' : 'AL DIA' }}
      </v-alert>
      <v-btn
        :color="isRetired ? 'green darken-4' : isInDebt ? 'blue darken-4' : 'red'"
        :disabled="$store.state.offer.offerHistory < 1 ? true : false"
        x-large
        rounded
        @click="setNewDebt"
      >
        <v-icon>{{ isRetired ? 'mdi-check-all' : isInDebt ? 'mdi-check-all' : 'mdi-cancel' }}</v-icon>
        {{ isRetired ? 'REACTIVAR' : isInDebt ? 'RECONECTAR' : 'CORTAR' }}
      </v-btn>
      <span v-if="!isInDebt && !isRetired" class="text-subtitle-2 grey--text lighten-2 mt-2">Para retirar el cliente es necesario antes cortarlo</span>
    </div>
    <div v-if="isInDebt && !isRetired" class="mb-5" style="display:grid;place-items:center;">
      <v-btn color="yellow darken-4" x-large rounded @click="isRetired ? setRetired : reasonDialog = true">
        <v-icon>mdi-cancel</v-icon>
        {{ isRetired ? 'REACTIVAR' : 'RETIRAR' }}
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
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isInDebt: null,
      isRetired: null,
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
  mounted () {
    this.getLastDebtMovement()
  },
  methods: {
    async setNewDebt () {
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        city: this.city,
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
          newPlan: !this.isInDebt === true ? { id: 7 } : this.$store.state.offer.offerHistory[0].offer.plan,
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
      })
    },
    async setRetired () {
      if (this.reason === '') {
        this.$toast.error('Debe ingresar una razon de retiro', { duration: 10000 })
        return
      }
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
        this.getLastDebtMovement()
        this.$store.dispatch('client/setPlanFromModal', {
          clientId: this.client.id,
          clientIndex: this.index,
          isOfferChange: false,
          kick: true,
          newPlan: !this.isRetired === true ? { id: 8 } : this.$store.state.offer.offerHistory[0].offer.plan,
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
        this.reasonDialog = false
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
          city: this.city,
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
