<template>
  <div>
    <MainTicketsDx v-if="$route.query.view === 'DX'" />
    <MainTickets v-else />
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
