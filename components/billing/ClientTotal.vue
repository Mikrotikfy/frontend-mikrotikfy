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
      return this.$store.state.billing.billingInfo?.movements?.reduce((total, item) => {
        return item.type === 'RECAUDO'
          ? total > 0
            ? total - item.acount < 1
              ? 0
              : total - item.amount
            : total
          : total + item.amount
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
