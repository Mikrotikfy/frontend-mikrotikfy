<template>
  <span>
    <BillingClientSearch />
    <BillingClientList v-if="$route.query.search" />
  </span>
</template>
<script>
export default {
  head () {
    return {
      title: 'Estado de Cuenta'
    }
  }
}
</script>
