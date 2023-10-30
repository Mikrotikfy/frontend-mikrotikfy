<template>
  <v-card class="mb-4 rounded-xl mx-auto elevation-0">
    <v-card-text class="d-flex">
      <v-select
        v-model="selectedCity"
        :items="cities"
        label="Filtrar Ciudad"
        item-value="id"
        item-text="name"
        return-object
        filled
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
      loading: false,
      selectedCity: null,
      selectedClienttype: null
    }
  },
  computed: {
    clienttypes () {
      return this.$store.state.auth.clienttypes
    },
    cities () {
      return this.$store.state.auth.cities
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
    this.setSelectedCity()
    this.setSelectedClienttype()
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
    setSelectedCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    setSelectedClienttype () {
      if (this.$route.query.clienttype) {
        this.selectedClienttype = this.$store.state.auth.clienttypes.find(c => c.name === this.$route.query.clienttype)
      }
    },
    async getListOfBills () {
      if (this.month && this.year) {
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
}
</script>
