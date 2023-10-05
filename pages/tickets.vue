<template>
  <div>
    <MainTickets />
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  head () {
    return {
      title: 'Tickets API ARNOP'
    }
  }
}
</script>
