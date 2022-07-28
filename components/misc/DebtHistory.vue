<template>
  <v-card class="elevation-0">
    <v-card-title>
      Historial de Movimientos
    </v-card-title>
    <v-card-text>
      <div>
        <p
          v-for="(debt, index) in debtHistory"
          :key="index"
        >
          {{ debt.isindebt ? 'EN MORA' : 'AL DIA' }} - {{ getDate(debt.createdAt) }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'DebtHistory',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    debtHistory () {
      return this.$store.state.offer.debtHistory
    }
  },
  mounted () {
    this.getDebtHistory()
  },
  methods: {
    getDebtHistory () {
      this.$store.dispatch('offer/getDebtHistory', {
        client: this.client,
        token: this.$store.state.auth.token
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
