<template>
  <v-card class="mb-4 rounded-xl mx-auto elevation-0" width="800">
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
  watch: {
    month () {
      this.getListOfBills()
      this.setMonth()
    },
    year () {
      this.getListOfBills()
      this.setYear()
    }
  },
  mounted () {
    this.year = new Date().getFullYear()
  },
  methods: {
    setYear () {
      this.$store.commit('notification/setYear', {
        year: this.year
      })
    },
    setMonth () {
      this.$store.commit('notification/setMonth', {
        month: this.month
      })
    },
    async getListOfBills () {
      await this.$store.dispatch('notification/getListOfBills', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        month: this.month,
        year: this.year
      })
    }
  }
}
</script>
