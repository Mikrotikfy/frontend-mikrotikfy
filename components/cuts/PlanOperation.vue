<template>
  <div>
    <v-card>
      <v-card-text>
        Aplicar {{ offerForBulkProcess ? offerForBulkProcess.name : '' }} a {{ clientsByPlan.length }} clientes
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    clientsByPlan () {
      return this.$store.state.cuts.clientsByPlan
    },
    offerForBulkProcess () {
      return this.$store.state.cuts.offerForBulkProcess
    }
  }
}
</script>
