<template>
  <p>
    .
  </p>
</template>
<script>
export default {
  mounted () {
    this.$router.push({
      path: `/clients?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}`
    })
  }
}
</script>
