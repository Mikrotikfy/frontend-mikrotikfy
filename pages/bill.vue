<template>
  <div class="output">
    <BillingBillTemplate :bill="bill" />
  </div>
</template>
<script>
export default {
  name: 'Bill',
  layout: 'print',
  data () {
    return {
      bill: {}
    }
  },
  async mounted () {
    this.bill = await this.$store.dispatch('billing/getBillById', {
      token: this.$store.state.auth.token,
      id: this.$route.query.id
    })
  },
  head () {
    return {
      title: 'Imprimir Recibo'
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
