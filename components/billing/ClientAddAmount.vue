<template>
  <span class="d-flex">
    <v-text-field
      v-model.number="amount"
      type="number"
      label="Generar Cobro"
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
      @keyup.enter="getClientBySearch"
    />
  </span>
</template>
<script>
export default {
  data () {
    return {
      amount: 0,
      billtype: {
        id: 1,
        name: 'FACTURA MES'
      },
      billtypes: [
        {
          id: 1,
          name: 'FACTURA MES'
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
  }
}
</script>
