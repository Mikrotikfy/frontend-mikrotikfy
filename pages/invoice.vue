<template>
  <div class="output">
    <BillingInvoiceTemplate :invoice="invoice" />
  </div>
</template>
<script>
export default {
  name: 'Invoice',
  layout: 'print',
  data () {
    return {
      invoice: null
    }
  },
  async mounted () {
    this.invoice = await this.$store.dispatch('billing/getInvoiceById', {
      token: this.$store.state.auth.token,
      id: this.$route.query.id
    })
  },
  head () {
    return {
      title: 'Imprimir Estado de Cuenta'
    }
  }
}
</script>
<style>
.output {
  transform: scale(0.9);
  width: 100vw;
  height: 24.9cm;
}
</style>
