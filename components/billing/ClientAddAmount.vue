<template>
  <v-card class="mt-2 rounded-lg">
    <v-card-text class="d-flex">
      <v-text-field
        v-model.number="amount"
        type="number"
        label="Generar Cobro $0.00"
        single-line
        hide-details
        filled
        rounded
        autofocus
        placeholder="$0.00"
        prepend-icon="mdi-currency-usd"
        color="red"
        @keyup.enter="addAmount"
      />
      <v-autocomplete
        v-model="billtype"
        :items="billtypes"
        item-text="name"
        item-value="id"
        label="Tipo de cobro"
        class="ml-4"
        return-object
        single-line
        hide-details
        filled
        rounded
        autofocus
        @keyup.enter="addAmount"
      />
      <v-text-field
        v-model="details"
        label="Observaciones (OPCIONAL)"
        class="ml-4 d-flex"
        single-line
        hide-details
        filled
        rounded
        color="blue"
        @keyup.enter="addAmount"
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      amount: null,
      details: null,
      billtype: {
        id: 1,
        name: 'FACTURACION'
      },
      billtypes: [
        {
          id: 1,
          name: 'FACTURACION'
        },
        {
          id: 2,
          name: 'TRASLADO'
        },
        {
          id: 3,
          name: 'EQUIPO NUEVO'
        },
        {
          id: 4,
          name: 'REPETIDOR'
        },
        {
          id: 5,
          name: 'OTROS'
        }
      ]
    }
  },
  methods: {
    addAmount () {
      this.$store.dispatch('billing/addMovement', {
        amount: this.amount,
        details: this.details,
        client: this.$store.state.billing.billingInfo.clientId,
        billtype: this.billtype
      })
      this.amount = null
      this.details = null
    }
  }
}
</script>
