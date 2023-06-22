<template>
  <div>
    <v-btn
      x-small
      color="green darken-4"
      elevation="0"
      @click="init"
    >
      Pagar
      <v-icon>mdi-cash-plus</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="550"
    >
      <v-card class="pt-4">
        <v-card-text>
          <v-text-field
            v-model.number="billingInfo.payBill.amount"
            :disabled="billingInfo.payBill.isComplete"
            type="number"
            label="Abono parcial"
            prepend-inner-icon="mdi-currency-usd"
            outlined
            class="mt-4"
            @keyup.enter="createInvoiceMovement"
          />
          <v-text-field
            v-model="billingInfo.payBill.details"
            label="Observaciones (OPCIONAL)"
            prepend-inner-icon="mdi-comment-text-outline"
            outlined
            @keyup.enter="createInvoiceMovement"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            ref="cbtn"
            block
            class="rounded-xl mb-4"
            :color="billingInfo.payBill.amount > 0 ? 'yellow darken-4' : 'primary' "
            @click.enter="createInvoiceMovement"
          >
            {{ billingInfo.payBill.amount > 0 ? 'Abonar' : 'Pago Completo' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    invoice: {
      type: Object,
      required: true
    },
    balance: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      billingInfo: {
        payBill: {
          amount: null,
          details: null
        }
      }
    }
  },
  methods: {
    init () {
      if (this.balance < 1) {
        this.$toast.info('No hay nada para recarudar. el usuario esta al dia', { duration: 2000 })
        return
      }
      this.dialog = true
      this.billingInfo.payBill.amount = null
      this.billingInfo.payBill.details = null
      setTimeout(() => {
        this.$refs.cbtn.$el.focus()
      }, 200)
    },
    createInvoiceMovement () {
      if (this.billingInfo.payBill.amount && this.billingInfo.payBill.amount > this.balance) {
        this.$toast.error('El valor a recaudar no puede ser mayor al saldo', { duration: 2000 })
        this.error = true
        return
      }
      this.$store.dispatch('billing/createInvoiceMovement', {
        token: this.$store.state.auth.token,
        biller: this.$store.state.auth,
        invoice: this.invoice,
        amount: this.billingInfo.payBill.amount || this.balance,
        details: this.billingInfo.payBill.details
      })
      this.$store.dispatch('billing/updateInvoice', {
        token: this.$store.state.auth.token,
        index: this.index,
        invoice: this.invoice,
        payed: this.billingInfo.payBill.amount === this.balance || !this.billingInfo.payBill.amount,
        balance: this.billingInfo.payBill.amount ? this.balance - this.billingInfo.payBill.amount : this.balance - this.invoice.balance
      })
      this.getBillingInfoByClientId()
      this.$store.commit('billing/resetSelected')
      this.amount = null
      this.dialog = false
    },
    getBillingInfoByClientId () {
      this.$store.dispatch('billing/getBillingInfoByClientId', {
        clientId: this.$route.query.selected,
        showArchive: this.$store.state.billing.showArchive,
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
