<template>
  <v-card :loading="loading" class="mb-4 rounded-xl mx-auto elevation-0">
    <v-card-title class="text-caption text-center justify-center">
      <strong class="mr-1">Generar estados de cuenta para {{ activeServices.length }}</strong> servicios activos en {{ $route.query.city }} a la fecha
    </v-card-title>
    <v-card-text class="d-flex">
      <v-select
        v-model="selectedCity"
        :items="cities"
        label="Filtrar Ciudad"
        item-value="id"
        item-text="name"
        return-object
        filled
        dense
        rounded
        hide-details="auto"
        class="mr-2 elevation-0"
        style="width:180px;"
        @change="changeCity(selectedCity)"
      >
        <template v-slot:item="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-select
        v-model="selectedClienttype"
        :items="clienttypes"
        label="Filtrar Servicio"
        item-value="id"
        item-text="name"
        return-object
        filled
        dense
        rounded
        hide-details="auto"
        class="mr-2 elevation-0"
        style="width:180px;"
        @change="changeType(selectedClienttype)"
      >
        <template v-slot:item="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-select
        v-model="month"
        :items="months"
        return-object
        label="Mes a facturar"
        filled
        dense
        rounded
        hide-details="auto"
        class="mr-2"
      />
      <v-text-field
        v-model.number="year"
        label="Año a facturar"
        type="number"
        filled
        rounded
        dense
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
      selectedCity: null,
      selectedClienttype: null,
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
    activeServices () {
      return this.$store.state.billing.activeServices
    },
    clienttypes () {
      return this.$store.state.auth.clienttypes
    },
    cities () {
      return this.$store.state.auth.cities
    }
  },
  watch: {
    month (newVal, oldVal) {
      if (newVal) {
        this.setMonth()
        this.getListOfActiveServices()
        this.backToE1()
      }
    },
    year () {
      this.setYear()
    },
    '$route' () {
      this.backToE1()
      this.$store.commit('billing/resetListOfActiveServices')
      this.month = null
      this.setMonth()
    }
  },
  mounted () {
    this.year = new Date().getFullYear()
    this.setQueryCity()
    this.setSelectedClienttype()
  },
  methods: {
    changeCity (city) {
      this.$router.push({ query: { city: city.name, clienttype: this.$route.query.clienttype, view: this.$route.query.view } })
    },
    changeType (clienttype) {
      this.$router.push({ query: { city: this.$route.query.city, clienttype: clienttype.name, view: this.$route.query.view } })
    },
    setQueryCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    setSelectedClienttype () {
      if (this.$route.query.clienttype) {
        this.selectedClienttype = this.$store.state.auth.clienttypes.find(c => c.name === this.$route.query.clienttype)
      }
    },
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
    async getListOfActiveServices () {
      this.loading = true
      await this.$store.dispatch('billing/getListOfActiveServices', {
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
