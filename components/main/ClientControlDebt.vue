<template>
  <div v-if="this.$store.state.offer.lastDebtMovement" class="mb-5" style="display:grid;place-items:center;">
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
      offers: []
    }
  },
  computed: {
    isInDebt () {
      return this.$store.state.offer.lastDebtMovement ? this.$store.state.offer.lastDebtMovement.isindebt : null
    },
    isRetired () {
      return this.$store.state.offer.lastDebtMovement ? this.$store.state.offer.lastDebtMovement.isretired : null
    }
  },
  methods: {
    setNewDebt () {
      this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        isindebt: !this.isInDebt,
        client: this.client,
        technician: this.$store.state.auth
      })
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
