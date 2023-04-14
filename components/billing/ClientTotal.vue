<template>
  <h2 class="align-center">
    $<span
      style="color:green;"
    >
      {{ Number(totalamount).toLocaleString('es') }}
    </span> saldo total
  </h2>
</template>
<script>
export default {
  data () {
    return {}
  },
  computed: {
    totalamount () {
      return this.$store.state.billing.invoices?.reduce((total, item) => {
        if (item.payed) {
          return total
        } else {
          return (total + item.value) - (item.invoice_movements.reduce((total, curr) => {
            return total + curr.amount
          }, 0))
        }
      }, 0)
    }
  },
  watch: {
    totalamount () {
      this.$store.commit('billing/setTotal', this.totalamount)
    }
  }
}
</script>
