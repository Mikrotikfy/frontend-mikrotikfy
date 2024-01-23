<template>
  <div>
    <MainTickets />
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: 'Tickets ' + this.$route.query.clienttype + ' ' + this.$route.query.city
    }
  }
}
</script>
