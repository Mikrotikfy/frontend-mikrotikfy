<template>
  <v-card class="elevation-0">
    <v-card-title class="justify-center">
      Historial de Movimientos
    </v-card-title>
    <v-card-text style="display:grid;place-items:center;max-height:400px;overflow-y:scroll;">
      <v-chip
        v-for="(debt, index) in debtHistory"
        :key="index"
        rounded
        :color="debt.isindebt ? 'red' : 'green darken-3'"
        class="mb-2"
      >
        {{ debt.isindebt ? 'EN MORA' : 'AL DIA' }} - {{ getDate(debt.createdAt) }} - {{ debt.technician ? debt.technician.username : '' }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'DebtHistory',
  data () {
    return {}
  },
  computed: {
    debtHistory () {
      return this.$store.state.offer.debtHistory
    }
  },
  methods: {
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
