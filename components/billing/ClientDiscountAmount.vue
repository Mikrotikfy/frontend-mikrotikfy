<template>
  <v-card class="mt-5 rounded-xl">
    <v-card-text class="d-flex">
      <v-text-field
        v-model.number="amount"
        type="number"
        label="Recaudar $0.00"
        single-line
        hide-details
        filled
        rounded
        autofocus
        placeholder="$0.00"
        prepend-icon="mdi-account-cash-outline"
        color="green"
        @keyup.enter="addDiscountMovement"
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      amount: null
    }
  },
  methods: {
    addDiscountMovement () {
      if (this.$store.state.billing.billingInfo.clientId > 0) {
        this.$store.dispatch('billing/addDiscountMovement', {
          amount: this.amount,
          client: this.$store.state.billing.billingInfo.clientId
        })
        this.amount = null
      }
    }
  }
}
</script>
