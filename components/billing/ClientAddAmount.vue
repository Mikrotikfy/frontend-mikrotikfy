<template>
  <v-card class="mt-2 rounded-lg">
    <v-card-text>
      <v-form v-model="valid" action="" class="d-flex">
        <v-btn
          v-if="amount"
          :disabled="!valid"
          color="primary"
          class="mr-2"
          rounded
          @click="addAmount"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
        <v-text-field
          v-model.number="amount"
          type="number"
          label="Generar Cobro $0.00"
          :rules="canNotBeNullNorContainCommasOrDots"
          single-line
          dense
          filled
          rounded
          hide-details="auto"
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
          dense
          rounded
          autofocus
          @keyup.enter="addAmount"
        />
        <v-text-field
          v-model.number="month"
          type="number"
          label="Mes"
          class="ml-4"
          :rules="maxNumberEqualsCurrentMonth"
          single-line
          hide-details="auto"
          filled
          dense
          rounded
          @keyup.enter="addAmount"
        />
        <v-text-field
          v-model.number="year"
          type="number"
          label="Año"
          class="ml-4"
          :rules="maxNumberEqualsCurrentYear"
          single-line
          hide-details="auto"
          filled
          dense
          rounded
          @keyup.enter="addAmount"
        />
        <v-text-field
          v-model="details"
          label="Observaciones (OPCIONAL)"
          class="ml-4 d-flex"
          single-line
          hide-details
          filled
          dense
          rounded
          color="blue"
          @keyup.enter="addAmount"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      valid: true,
      amount: null,
      details: null,
      month: this.getCurrentMonth(),
      year: this.getCurrentYear(),
      maxNumberEqualsCurrentYear: [
        v => v <= this.getCurrentYear() || 'El año no puede ser mayor al actual'
      ],
      maxNumberEqualsCurrentMonth: [
        v => v <= this.getCurrentMonth() || 'El mes no puede ser mayor al actual'
      ],
      canNotBeNullNorContainCommasOrDots: [
        v => !!v || 'El monto no puede estar vacío',
        v => !v?.toString().includes(',') || 'No se permiten comas',
        v => !v?.toString().includes('.') || 'No se permiten puntos'
      ],
      billtype: {
        id: 1,
        name: 'FACTURACION MENSUAL'
      }
    }
  },
  computed: {
    billtypes () {
      return this.$store.state.invoicetypes
    }
  },
  methods: {
    addAmount () {
      this.$store.dispatch('billing/addMovement', {
        balance: this.amount,
        month: this.month,
        year: this.year,
        type: 'FACTURA',
        offer: 1,
        concept: this.details,
        payed: false,
        partial: false,
        indebt: false,
        client: this.$route.query.selected,
        invoice_type: this.billtype.id,
        token: this.$store.state.auth.token
      })
      this.amount = null
      this.details = null
    },
    getCurrentMonth () {
      const date = new Date()
      const month = date.getMonth() + 1
      return month < 10 ? `0${month}` : month
    },
    getCurrentYear () {
      const date = new Date()
      return date.getFullYear()
    }
  }
}
</script>
