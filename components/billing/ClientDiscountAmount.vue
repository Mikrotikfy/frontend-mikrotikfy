<template>
  <v-card class="mt-2 rounded-lg">
    <v-card-text>
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
        :disabled="loading"
        :loading="loading"
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
  props: {
    service: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      amount: null,
      error: false,
      loading: false
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
    async addDiscountMovement () {
      this.loading = true
      if (this.amount > this.total) {
        this.$toast.error('El valor a recaudar no puede ser mayor al saldo total', { duration: 2000 })
        this.error = true
        this.loading = false
        return
      }
      if (!this.amount || this.amount === 0) {
        this.$toast.error('Debe ingresar un valor', { duration: 2000 })
        this.loading = false
        return
      }
      await this.payInvoicesFromOlderToNewer(this.invoices, this.amount)
      this.amount = null
    },
    async payInvoicesFromOlderToNewer (invoices, amount) {
      let total = amount
      const copyInvoices = JSON.parse(JSON.stringify(invoices))
      const monthlyInvoices = copyInvoices.filter(invoice => invoice.invoice_type.name === 'FACTURACION MENSUAL')
      const otherInvoices = copyInvoices.filter(invoice => invoice.invoice_type.name !== 'FACTURACION MENSUAL')
      for (let i = 0; i < monthlyInvoices.length; i++) {
        if (total > 0) {
          if (monthlyInvoices[i].balance > total) {
            monthlyInvoices[i].balance -= total
            monthlyInvoices[i].payed = false
            monthlyInvoices[i].discountedAmount = total
            total = 0
          } else {
            total -= monthlyInvoices[i].balance
            monthlyInvoices[i].discountedAmount = monthlyInvoices[i].balance
            monthlyInvoices[i].balance = 0
            monthlyInvoices[i].payed = true
          }
        }
      }
      if (total > 0) {
        for (let i = 0; i < otherInvoices.length; i++) {
          if (total > 0) {
            if (otherInvoices[i].balance > total) {
              otherInvoices[i].balance -= total
              otherInvoices[i].payed = false
              otherInvoices[i].discountedAmount = total
              total = 0
            } else {
              total -= otherInvoices[i].balance
              otherInvoices[i].discountedAmount = otherInvoices[i].balance
              otherInvoices[i].balance = 0
              otherInvoices[i].payed = true
            }
          }
        }
      }
      await this.saveInvoicesToLocalstorage(copyInvoices, amount)
    },
    async saveInvoicesToLocalstorage (invoices, amount) {
      const isConnected = await this.$checkInternetConnection()
      if (isConnected) {
        const legalNote = await this.saveLegalNoteToDb(invoices, amount)
        await this.saveInvoicesToDb(invoices, legalNote, amount)
      } else {
        this.$toast.info('No ha sido posible guardar el descuento en base de datos. Reintentando en 10 segundos.', { duration: 2000 })
        setTimeout(() => {
          this.saveInvoicesToLocalstorage(invoices)
        }, 10000)
      }
    },
    async saveInvoicesToDb (invoices, legalNote) {
      for (let i = 0; i < invoices.length; i++) {
        await this.$store.dispatch('billing/createInvoiceMovement', {
          token: this.$store.state.auth.token,
          biller: this.$store.state.auth,
          invoice: invoices[i],
          amount: invoices[i].discountedAmount,
          details: 'DESCUENTO EN LOTE',
          type: invoices[i].invoice_type.name,
          concept: invoices[i].details,
          legalNote: legalNote.id
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
      this.loading = false
      window.open(`/bill?id=${legalNote.id}`)
    },
    async saveLegalNoteToDb (invoices, amount) {
      const legalNote = {
        city: this.service.city.name,
        clienttype: this.service.name,
        token: this.$store.state.auth.token,
        biller: this.$store.state.auth,
        service: this.service.id,
        debit: 0,
        credit: amount,
        connect: true,
        invoices
      }
      const legalNoteRes = await this.$store.dispatch('billing/createLegalNote', legalNote)
      return legalNoteRes
    }
  }
}
</script>
