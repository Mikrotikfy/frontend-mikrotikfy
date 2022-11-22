<template>
  <v-card class="mb-4 rounded-xl">
    <v-card-text>
      <v-select
        v-model="month"
        :items="months"
        return-object
        label="Mes a facturar"
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
      ]
    }
  },
  watch: {
    month () {
      this.getListOfBills()
      this.setMonth()
    }
  },
  methods: {
    setMonth () {
      this.$store.commit('notification/setMonth', {
        month: this.month
      })
    },
    getListOfBills () {
      this.$store.dispatch('notification/getListOfBills', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        month: this.month
      })
    }
  }
}
</script>
