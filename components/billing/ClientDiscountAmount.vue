<template>
  <v-card class="mt-2 rounded-lg">
    <v-card-text class="d-flex">
      <v-text-field
        v-model.number="amount"
        type="number"
        label="Recaudar a mensualidad $0.00"
        single-line
        hide-details
        filled
        rounded
        autofocus
        placeholder="Recaudar a mensualidad $0.00"
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
      if (!this.amount || this.amount === 0) {
        this.$toast.error('Debe ingresar un valor', { duration: 2000 })
        localStorage.removeItem('pendingDiscountToSaveOnDB')
        return
      }
      localStorage.removeItem('invoicesForPrint')
      this.payInvoicesFromOlderToNewer(this.invoices, this.amount)
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
              copyInvoices[i].payed = false
              total = 0
            } else {
              total -= copyInvoices[i].balance
              copyInvoices[i].balance = 0
              copyInvoices[i].payed = true
            }
          }
        }
      }
      this.saveInvoicesToLocalstorage(copyInvoices, amount)
    },
    async saveInvoicesToLocalstorage (invoices, amount) {
      const pendingDiscountToSaveOnDB = localStorage.getItem('pendingDiscountToSaveOnDB')
      const isConnected = await this.$checkInternetConnection()
      if (isConnected) {
        if (pendingDiscountToSaveOnDB) {
          this.$toast.info('Se ha encontrado un descuento pasado pendiente por subir.', { duration: 2000 })
          const invoicesToSaveOnDB = JSON.parse(localStorage.getItem('invoices'))
          await this.saveInvoicesToDb(invoicesToSaveOnDB)
        }
        localStorage.setItem('invoices', JSON.stringify(invoices))
        localStorage.setItem('invoicesForPrint', JSON.stringify(invoices))
        localStorage.setItem('pendingDiscountToSaveOnDB', true)
        await this.saveInvoicesToDb(invoices)
        await this.saveReceiptToDb(invoices, amount)
      } else {
        this.$toast.success('Se ha guardado el descuento en el dispositivo', { duration: 2000 })
        this.$toast.info('No ha sido posible guardar el descuento en base de datos. Reintentando en 10 segundos.', { duration: 2000 })
        setTimeout(() => {
          this.saveInvoicesToLocalstorage(invoices)
        }, 10000)
      }
    },
    async saveInvoicesToDb (invoices) {
      for (let i = 0; i < invoices.length; i++) {
        await this.$store.dispatch('billing/createInvoiceMovement', {
          token: this.$store.state.auth.token,
          biller: this.$store.state.auth,
          invoice: invoices[i],
          amount: invoices[i].value - invoices[i].balance,
          details: 'DESCUENTO EN LOTE'
        })
        await this.$store.dispatch('billing/updateInvoice', {
          token: this.$store.state.auth.token,
          invoice: invoices[i],
          payed: invoices[i].payed,
          balance: invoices[i].balance
        })
      }
      this.$store.commit('billing/resetSelected')
      this.$store.commit('billing/refresh')
      localStorage.removeItem('pendingDiscountToSaveOnDB')
      localStorage.removeItem('invoices')
    },
    async saveReceiptToDb (invoices, amount) {
      const receipt = {
        token: this.$store.state.auth.token,
        biller: this.$store.state.auth,
        amount,
        invoices
      }
      const receiptRes = await this.$store.dispatch('billing/createReceipt', receipt)
      window.open(`/bill?id=${receiptRes.id}`)
    }
  }
}
</script>
