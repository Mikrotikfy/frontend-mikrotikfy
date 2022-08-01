<template>
  <div v-if="isInDebt !== null" class="mb-5" style="display:grid;place-items:center;">
    <v-alert text dense :type="isRetired ? 'error' : isInDebt ? 'error' : 'success'">
      El Cliente esta {{ isRetired ? 'RETIRADO' : isInDebt ? 'EN MORA' : 'AL DIA' }}
    </v-alert>
    <v-btn :color="isRetired ? 'green darken-4' : isInDebt ? 'green darken-4' : 'red'" x-large rounded @click="setNewDebt">
      <v-icon>{{ isRetired ? 'mdi-check-all' : isInDebt ? 'mdi-check-all' : 'mdi-cancel' }}</v-icon>
      {{ isRetired ? 'RECONECTAR' : isInDebt ? 'RECONECTAR' : 'CORTAR' }}
    </v-btn>
  </div>
  <div v-else class="mb-5" style="display:grid;place-items:center;">
    <v-alert text dense :type="isRetired ? 'error' : isInDebt ? 'error' : 'success'">
      El Cliente esta {{ getState(client.plan.name) }}
    </v-alert>
    <v-btn x-large rounded @click="setNewDebt">
      <v-icon>mdi-check-all</v-icon>
      INICIALIZAR
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ClientControlDebt',
  props: {
    client: {
      type: Object,
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
  mounted () {
    this.getLastDebtMovement()
  },
  methods: {
    async setNewDebt () {
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        isindebt: !this.isInDebt,
        client: this.client,
        technician: this.$store.state.auth
      }).then(() => {
        this.getLastDebtMovement()
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
