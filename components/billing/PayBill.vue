<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          x-small
          color="green darken-4"
          elevation="0"
          v-on="on"
          @click="init"
        >
          <v-icon>mdi-cash-plus</v-icon>
        </v-btn>
      </template>
      <span>Abono Dirigido</span>
    </v-tooltip>
    <v-dialog
      v-model="dialog"
      width="550"
    >
      <v-card :loading="loading" class="pt-4">
        <v-card-text>
          <v-text-field
            v-model.number="billingInfo.payBill.amount"
            :disabled="loading"
            type="number"
            label="Abono parcial"
            prepend-inner-icon="mdi-currency-usd"
            outlined
            class="mt-4"
            @keyup.enter="createInvoiceMovement"
          />
          <v-text-field
            v-model="billingInfo.payBill.details"
            :disabled="loading"
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
            :disabled="loading"
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
    service: {
      type: Object,
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
      loading: false,
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
    async createInvoiceMovement () {
      if (this.loading) { return }
      this.loading = true
      if (this.billingInfo.payBill.amount && this.billingInfo.payBill.amount > this.balance) {
        this.$toast.error('El valor a recaudar no puede ser mayor al saldo', { duration: 2000 })
        this.error = true
        return
      }
      const legalNote = {
        city: this.service.city.name,
        clienttype: this.service.name,
        token: this.$store.state.auth.token,
        biller: this.$store.state.auth,
        service: this.service.id,
        concept: this.invoice.invoice_type.name === 'FACTURACION MENSUAL' ? this.invoice.details : this.invoice.invoice_type.name,
        debit: 0,
        credit: this.billingInfo.payBill.amount || this.balance,
        connect: true,
        invoices: [this.invoice]
      }
      const legalNoteRes = await this.$store.dispatch('billing/createLegalNote', legalNote)
      await this.$store.dispatch('billing/createInvoiceMovement', {
        token: this.$store.state.auth.token,
        biller: this.$store.state.auth,
        invoice: this.invoice,
        type: this.invoice.invoice_type.name,
        concept: this.invoice.details,
        amount: this.billingInfo.payBill.amount || this.balance,
        details: this.billingInfo.payBill.details,
        legalNote: legalNoteRes.id
      })
      await this.$store.dispatch('billing/updateInvoice', {
        token: this.$store.state.auth.token,
        index: this.index,
        invoice: this.invoice,
        payed: this.billingInfo.payBill.amount === this.balance || !this.billingInfo.payBill.amount,
        balance: this.billingInfo.payBill.amount ? this.balance - this.billingInfo.payBill.amount : this.balance - this.invoice.balance
      })
      window.open(`/bill?id=${legalNoteRes.id}`)
      this.$store.commit('billing/resetSelected')
      this.$store.commit('billing/refresh')
      this.loading = false
      this.dialog = false
    }
  }
}
</script>
