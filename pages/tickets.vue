<template>
  <div>
    <MainTickets />
  </div>
</template>

<script>
export default {
  middleware: ['defaultCity', 'authenticated'],
  head () {
    return {
      title: 'Tickets API ARNOP'
    }
  }
}
</script>
