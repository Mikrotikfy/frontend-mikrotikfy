<template>
  <v-btn
    icon
    color="white black--text"
    @click="openPrintReceipt(invoices)"
  >
    <v-icon>mdi-printer</v-icon>
  </v-btn>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    invoices () {
      return this.$store.state.billing.invoices
    }
  },
  methods: {
    openPrintReceipt (invoices) {
      localStorage.removeItem('invoicesToPrint')
      localStorage.setItem('invoicesToPrint', JSON.stringify(invoices))
      window.open(`/invoices?service=${this.service.id}`)
    }
  }
}
</script>
