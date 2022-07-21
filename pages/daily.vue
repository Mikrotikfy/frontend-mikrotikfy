<template>
  <div>
    <DailyPendingClients />
    <DailyPendingTraslates />
  </div>
</template>

<script>
export default {
  middleware: ['defaultCity', 'authenticated'],
  head () {
    return {
      title: 'Diario API ARNOP'
    }
  }
}
</script>
