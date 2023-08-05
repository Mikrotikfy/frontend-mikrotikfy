<template>
  <v-card :loading="loading" class="mb-4 rounded-xl mx-auto elevation-0" width="1200">
    <v-card-title class="text-caption text-center justify-center">
      <strong class="mr-1">{{ activeClients.length }}</strong> clientes activos en {{ $route.query.city }} a la fecha
    </v-card-title>
    <v-card-text class="d-flex">
      <v-select
        v-model="month"
        :items="months"
        return-object
        label="Mes a facturar"
        filled
        rounded
        hide-details="auto"
        class="mr-4"
      />
      <v-text-field
        v-model.number="year"
        label="Año a facturar"
        type="number"
        filled
        rounded
        hide-details="auto"
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      year: 0,
      month: null,
      months: [
        {
          text: 'Enero',
          value: 1
        },
        {
          text: 'Febrero',
          value: 2
        },
        {
          text: 'Marzo',
          value: 3
        },
        {
          text: 'Abril',
          value: 4
        },
        {
          text: 'Mayo',
          value: 5
        },
        {
          text: 'Junio',
          value: 6
        },
        {
          text: 'Julio',
          value: 7
        },
        {
          text: 'Agosto',
          value: 8
        },
        {
          text: 'Septiembre',
          value: 9
        },
        {
          text: 'Octubre',
          value: 10
        },
        {
          text: 'Noviembre',
          value: 11
        },
        {
          text: 'Diciembre',
          value: 12
        }
      ],
      loading: false
    }
  },
  computed: {
    activeClients () {
      return this.$store.state.billing.activeClients
    }
  },
  watch: {
    month (newVal, oldVal) {
      if (newVal) {
        this.setMonth()
        this.getListOfActiveClients()
      }
    },
    year () {
      this.setYear()
    },
    '$route' () {
      this.backToE1()
      this.$store.commit('billing/resetListOfActiveClients')
      this.month = null
      this.setMonth()
    }
  },
  mounted () {
    this.year = new Date().getFullYear()
  },
  methods: {
    setYear () {
      this.$store.commit('billing/setYear', {
        year: this.year
      })
    },
    setMonth () {
      this.$store.commit('billing/setMonth', {
        month: this.month
      })
    },
    async getListOfActiveClients () {
      this.loading = true
      await this.$store.dispatch('billing/getListOfActiveClients', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        active: true
      })
      this.loading = false
    },
    removeOlderThanActualMonths () {
      const today = new Date()
      const currentMonth = today.getMonth() + 1
      this.months = this.months.filter((month) => {
        if (month.value >= currentMonth) {
          return true
        }
        return false
      })
    },
    backToE1 () {
      this.$store.commit('billing/e1', { e1: 1 })
    }
  }
}
</script>
