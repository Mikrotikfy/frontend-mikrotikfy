<template>
  <div v-if="$route.query.type">
    <MiscTicketHistoryJournal v-if="$route.query.type === 'tickethistory'" />
  </div>
</template>
<script>
export default {
  layout: 'outuser',
  head () {
    return {
      title: 'Informe por categoria'
    }
  }
}
</script>
