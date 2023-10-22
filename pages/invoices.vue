<template>
  <div class="output">
    <BillingInvoicesTemplate :invoices="invoices" :service="service" />
  </div>
</template>
<script>
export default {
  name: 'Invoices',
  layout: 'print',
  data () {
    return {
      invoices: [],
      service: null
    }
  },
  async mounted () {
    this.invoices = await this.$store.dispatch('billing/getInvoicesByServiceId', {
      token: this.$store.state.auth.token,
      serviceId: this.$route.query.service,
      payed: false
    })
    this.service = await this.$store.dispatch('billing/getServiceById', {
      token: this.$store.state.auth.token,
      serviceId: this.$route.query.service
    })
  },
  head () {
    return {
      title: 'Imprimir Estados de Cuenta'
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
