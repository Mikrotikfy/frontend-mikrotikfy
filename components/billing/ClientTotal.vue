<template>
  <h2 v-if="$store.state.billing.invoices" class="align-center">
    $<span
      style="color:green;"
    >
      {{ Number(totalamount).toLocaleString('es') }}
    </span> saldo total
  </h2>
  <h2 v-else>
    El usuario no tiene estados de cuenta aún...
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
          return total + item.balance
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
