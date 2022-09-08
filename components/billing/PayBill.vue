<template>
  <div>
    <v-btn
      x-small
      color="green darken-4"
      elevation="0"
      @click="init"
    >
      Abonar
      <v-icon>mdi-cash-plus</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="550"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Abonar a Factura</span>
        </v-card-title>
        <v-card-text>
          <v-switch
            v-model="billingInfo.payBill.isComplete"
            label="Pago completo"
          />
          <v-text-field
            v-model.number="billingInfo.payBill.amount"
            :disabled="billingInfo.payBill.isComplete"
            type="number"
            label="Abono parcial de"
            required
            :rules="!billingInfo.payBill.isComplete ? [v => !!v || 'Este campo es requerido'] : []"
            @keyup.enter="addAmount"
          />
          <v-text-field
            v-model="billingInfo.payBill.details"
            label="Observaciones (OPCIONAL)"
            @keyup.enter="addAmount"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            ref="cbtn"
            color="red darken-1"
            @click.enter="addAmount"
          >
            Continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    bill: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      billingInfo: {
        payBill: {
          isComplete: true,
          amount: null,
          details: null
        }
      }
    }
  },
  computed: {
    total () {
      return this.$store.state.billing.total
    }
  },
  methods: {
    init () {
      if (this.total < 1) {
        this.$toast.info('No hay nada para recarudar. el usuario esta al dia', { duration: 2000 })
        return
      }
      this.dialog = true
      setTimeout(() => {
        this.$refs.cbtn.$el.focus()
      })
    },
    addAmount () {
      if (this.billingInfo.payBill.amount > this.total || this.bill.amount > this.total) {
        this.$toast.error('El valor a recaudar no puede ser mayor al saldo total', { duration: 2000 })
        this.error = true
        return
      }
      if ((!this.bill.amount || !this.billingInfo.payBill.amount) && !this.billingInfo.payBill.isComplete) {
        this.$toast.error('Debe ingresar un valor', { duration: 2000 })
        return
      }
      this.$store.dispatch('billing/addDiscountMovement', {
        amount: this.billingInfo.payBill.isComplete ? this.bill.amount : this.billingInfo.payBill.amount,
        for: this.bill.id,
        billingMonth: this.bill.billingMonth,
        details: this.billingInfo.payBill.details,
        client: this.$store.state.billing.billingInfo.clientId
      })
      this.$store.dispatch('billing/setPay', {
        id: this.bill.id,
        pay: true
      })
      this.$store.commit('billing/resetSelected')
      this.amount = null
      this.dialog = false
    }
  }
}
</script>
