<template>
  <v-card class="mt-2 rounded-lg">
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
        placeholder="Recaudar $0.00"
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
    invoices () {
      return this.$store.state.billing.invoices
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
        localStorage.removeItem('pendingDiscountToSaveOnDB')
        return
      }
      if (!this.amount) {
        this.$toast.error('Debe ingresar un valor', { duration: 2000 })
        localStorage.removeItem('pendingDiscountToSaveOnDB')
        return
      }
      this.payInvoicesFromOlderToNewer(this.invoices, this.amount)
      this.$store.commit('billing/resetSelected')
      this.$store.commit('billing/refresh')
      this.amount = null
    },
    payInvoicesFromOlderToNewer (invoices, amount) {
      let total = amount
      const copyInvoices = JSON.parse(JSON.stringify(invoices))
      for (let i = 0; i < invoices.length; i++) {
        if (copyInvoices[i].invoice_type.name === 'MENSUALIDAD') {
          if (total > 0) {
            if (copyInvoices[i].balance > total) {
              copyInvoices[i].balance -= total
              total = 0
            } else {
              total -= copyInvoices[i].balance
              copyInvoices[i].balance = 0
            }
          }
        }
      }
      this.saveInvoicesToLocalstorage(copyInvoices)
    },
    async saveInvoicesToLocalstorage (invoices) {
      const pendingDiscountToSaveOnDB = localStorage.getItem('pendingDiscountToSaveOnDB')
      const isConnected = await this.$checkInternetConnection()
      if (isConnected) {
        if (pendingDiscountToSaveOnDB) {
          this.$toast.info('Se ha encontrado un descuento pasado pendiente por subir.', { duration: 2000 })
          const invoicesToSaveOnDB = JSON.parse(localStorage.getItem('invoices'))
          this.saveInvoicesToDb(invoicesToSaveOnDB)
        }
        localStorage.setItem('invoices', JSON.stringify(invoices))
        localStorage.setItem('pendingDiscountToSaveOnDB', true)
        this.saveInvoicesToDb(invoices)
      } else {
        this.$toast.success('Se ha guardado el descuento en el dispositivo', { duration: 2000 })
        this.$toast.info('No ha sido posible guardar el descuento en base de datos. Reintentando en 10 segundos.', { duration: 2000 })
        setTimeout(() => {
          this.saveInvoicesToLocalstorage(invoices)
        }, 10000)
      }
    },
    saveInvoicesToDb (invoices) {
      console.log('invoicesq', invoices)
      for (let i = 0; i < invoices.length; i++) {
        this.$store.dispatch('billing/createInvoiceMovement', {
          token: this.$store.state.auth.token,
          biller: this.$store.state.auth,
          invoice: invoices[i],
          amount: invoices[i].value,
          details: this.billingInfo.payBill.details
        })
        this.$store.dispatch('billing/updateInvoice', {
          token: this.$store.state.auth.token,
          index: this.index,
          invoice: this.invoice,
          payed: this.billingInfo.payBill.amount === this.balance || !this.billingInfo.payBill.amount,
          balance: this.billingInfo.payBill.amount ? this.balance - this.billingInfo.payBill.amount : this.balance - this.invoice.balance
        })
      }
      localStorage.removeItem('pendingDiscountToSaveOnDB')
      localStorage.removeItem('invoices')
    }
  }
}
</script>
