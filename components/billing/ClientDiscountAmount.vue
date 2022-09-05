<template>
  <v-card class="mt-2 rounded-xl">
    <v-card-text class="d-flex">
      <v-text-field
        v-model.number="amount"
        type="number"
        :disabled="selected.length < 1"
        :label="selected.length > 0 ? `Recaudar a ${selected[0].type}` : 'Recaudar $0.00'"
        single-line
        hide-details
        filled
        rounded
        autofocus
        :placeholder="selected.length > 0 ? `Recaudar a ${selected[0].type}` : 'Recaudar $0.00'"
        :error="error"
        prepend-icon="mdi-account-cash-outline"
        color="green"
        @keyup="error = false"
        @keyup.enter="addDiscountMovement"
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      amount: null,
      error: false
    }
  },
  computed: {
    selected () {
      return this.$store.state.billing.selected
    },
    total () {
      return this.$store.state.billing.total
    }
  },
  methods: {
    addDiscountMovement () {
      if (this.amount > this.total) {
        this.$toast.error('El valor a recaudar no puede ser mayor al saldo total', { duration: 2000 })
        this.error = true
        return
      }
      if (!this.amount) {
        this.$toast.error('Debe ingresar un valor', { duration: 2000 })
        return
      }
      if (this.$store.state.billing.billingInfo.clientId > 0) {
        this.$store.dispatch('billing/addDiscountMovement', {
          amount: this.amount,
          for: this.selected.length > 0 ? this.selected[0].id : null,
          billingMonth: this.selected[0].billingMonth,
          client: this.$store.state.billing.billingInfo.clientId
        })
        this.$store.commit('billing/resetSelected')
        this.amount = null
      }
    }
  }
}
</script>
